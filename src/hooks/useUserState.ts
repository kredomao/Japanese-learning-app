/**
 * ユーザー状態管理 React Hook（ゲーミフィケーション対応版）
 * Bolt.new側のUIから使用することを想定
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserState, LearningResult, Phrase, Achievement } from '../types';
import { loadUserState, resetUserState, initialUserState, saveUserState } from '../lib/storage';
import { getExpProgress, getLevelTitle } from '../lib/experience';
import {
  completeLearning,
  getLearningProgress,
  getRandomUnlearnedPhraseId,
  getAccessiblePhrases,
} from '../lib/learning';
import {
  getAchievementProgress,
  getUpcomingAchievements,
  getCurrentStreakBonus,
  getNextStreakMilestone,
  getDailyMissionDetails,
  claimMissionReward,
  markAchievementNotified,
} from '../lib/gamification';
import { ACHIEVEMENTS } from '../data/achievements';

/**
 * ユーザー状態を管理するカスタムフック
 */
export function useUserState() {
  const [userState, setUserState] = useState<UserState>(initialUserState);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化：LocalStorageから読み込み
  useEffect(() => {
    const stored = loadUserState();
    setUserState(stored);
    setIsLoading(false);
  }, []);

  // データリセット
  const reset = useCallback(() => {
    resetUserState();
    setUserState(initialUserState);
  }, []);

  // 称号を変更
  const changeTitle = useCallback((title: string) => {
    if (!userState.unlockedTitles.includes(title)) return;
    
    const newState = { ...userState, currentTitle: title };
    setUserState(newState);
    saveUserState(newState);
  }, [userState]);

  // 経験値進捗を取得
  const expProgress = getExpProgress(userState);

  // レベル称号を取得
  const levelTitle = getLevelTitle(userState.level);

  // 連続学習ボーナス情報
  const currentStreakBonus = getCurrentStreakBonus(userState.streak);
  const nextStreakMilestone = getNextStreakMilestone(userState.streak);

  // 実績進捗
  const achievementProgress = useMemo(
    () => getAchievementProgress(userState),
    [userState]
  );

  return {
    // 状態
    userState,
    isLoading,

    // 計算済みプロパティ
    expProgress,
    levelTitle,
    currentStreakBonus,
    nextStreakMilestone,
    achievementProgress,

    // アクション
    reset,
    changeTitle,
    setUserState,
  };
}

/**
 * フレーズ学習を管理するカスタムフック（ゲーミフィケーション対応版）
 */
export function usePhraselearning(phrases: Phrase[]) {
  const {
    userState,
    isLoading,
    expProgress,
    levelTitle,
    currentStreakBonus,
    nextStreakMilestone,
    achievementProgress,
    reset,
    changeTitle,
    setUserState,
  } = useUserState();

  const [currentPhraseId, setCurrentPhraseId] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<LearningResult | null>(null);
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);

  // アクセス可能なフレーズ（レベル制限）
  const accessiblePhrases = useMemo(
    () => getAccessiblePhrases(phrases, userState.level),
    [phrases, userState.level]
  );

  // 全フレーズIDを取得
  const allPhraseIds = useMemo(
    () => accessiblePhrases.map((p) => p.id),
    [accessiblePhrases]
  );

  // 学習進捗を取得
  const progress = getLearningProgress(userState, accessiblePhrases.length);

  // 現在のフレーズを取得
  const currentPhrase = useMemo(
    () => (currentPhraseId ? phrases.find((p) => p.id === currentPhraseId) ?? null : null),
    [currentPhraseId, phrases]
  );

  // 次の未学習フレーズを取得
  const goToNextPhrase = useCallback(() => {
    const nextId = getRandomUnlearnedPhraseId(userState, allPhraseIds);
    setCurrentPhraseId(nextId);
    return nextId;
  }, [userState, allPhraseIds]);

  // 特定のフレーズに移動
  const goToPhrase = useCallback((phraseId: number) => {
    setCurrentPhraseId(phraseId);
  }, []);

  // 初回ロード時に最初のフレーズを設定
  useEffect(() => {
    if (!isLoading && currentPhraseId === null && phrases.length > 0) {
      goToNextPhrase();
    }
  }, [isLoading, currentPhraseId, phrases.length, goToNextPhrase]);

  // 学習完了処理（ゲーミフィケーション対応）
  const markAsLearned = useCallback(
    (phraseId: number): LearningResult => {
      const phrase = phrases.find((p) => p.id === phraseId);
      const result = completeLearning(userState, phraseId, phrase, phrases);
      
      setUserState(result.userState);
      setLastResult(result);

      // 新しい実績があれば通知キューに追加
      if (result.newAchievements.length > 0) {
        setPendingAchievements((prev) => [...prev, ...result.newAchievements]);
      }

      return result;
    },
    [userState, phrases, setUserState]
  );

  // 学習完了してから次へ
  const learnAndNext = useCallback(
    (phraseId: number) => {
      const result = markAsLearned(phraseId);
      goToNextPhrase();
      return result;
    },
    [markAsLearned, goToNextPhrase]
  );

  // 実績通知を消化
  const dismissAchievement = useCallback((achievementId: string) => {
    setPendingAchievements((prev) =>
      prev.filter((a) => a.id !== achievementId)
    );
    const newState = markAchievementNotified(userState, achievementId);
    setUserState(newState);
    saveUserState(newState);
  }, [userState, setUserState]);

  // デイリーミッション
  const dailyMissions = useMemo(() => {
    if (!userState.dailyMissions) return [];
    return getDailyMissionDetails(userState.dailyMissions);
  }, [userState.dailyMissions]);

  // ミッション報酬を受け取る
  const claimMission = useCallback((missionId: string) => {
    if (!userState.dailyMissions) return 0;
    
    const { state: newMissionState, reward } = claimMissionReward(
      userState.dailyMissions,
      missionId
    );

    const newUserState: UserState = {
      ...userState,
      dailyMissions: newMissionState,
      experience: userState.experience + reward,
      totalExp: userState.totalExp + reward,
    };

    setUserState(newUserState);
    saveUserState(newUserState);
    return reward;
  }, [userState, setUserState]);

  // 次に解除できそうな実績
  const upcomingAchievements = useMemo(
    () => getUpcomingAchievements(userState, 3),
    [userState]
  );

  // 解除済み実績の詳細
  const unlockedAchievementDetails = useMemo(() => {
    return userState.unlockedAchievements.map((ua) => ({
      ...ua,
      achievement: ACHIEVEMENTS.find((a) => a.id === ua.achievementId)!,
    })).filter((a) => a.achievement);
  }, [userState.unlockedAchievements]);

  return {
    // 状態
    userState,
    isLoading,
    currentPhrase,
    currentPhraseId,
    lastResult,

    // 進捗
    expProgress,
    levelTitle,
    progress,

    // ゲーミフィケーション
    currentStreakBonus,
    nextStreakMilestone,
    achievementProgress,
    pendingAchievements,
    upcomingAchievements,
    unlockedAchievementDetails,
    dailyMissions,

    // アクション
    markAsLearned,
    learnAndNext,
    goToNextPhrase,
    goToPhrase,
    reset,
    changeTitle,
    dismissAchievement,
    claimMission,

    // フラグ
    isAllLearned: progress.learnedCount === progress.totalCount,
    hasNewAchievements: pendingAchievements.length > 0,
  };
}

/**
 * 実績一覧を管理するフック
 */
export function useAchievements() {
  const { userState } = useUserState();

  const allAchievements = useMemo(() => {
    const unlockedIds = new Set(
      userState.unlockedAchievements.map((a) => a.achievementId)
    );

    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      isUnlocked: unlockedIds.has(achievement.id),
      unlockedAt: userState.unlockedAchievements.find(
        (a) => a.achievementId === achievement.id
      )?.unlockedAt,
    }));
  }, [userState.unlockedAchievements]);

  const byCategory = useMemo(() => {
    const grouped: Record<string, typeof allAchievements> = {};
    for (const achievement of allAchievements) {
      if (!grouped[achievement.category]) {
        grouped[achievement.category] = [];
      }
      grouped[achievement.category].push(achievement);
    }
    return grouped;
  }, [allAchievements]);

  return {
    allAchievements,
    byCategory,
    progress: getAchievementProgress(userState),
  };
}
