/**
 * 学習完了処理（ゲーミフィケーション対応版）
 * 「覚えた」ボタン押下時の処理を担当
 */

import {
  UserState,
  LearningResult,
  ExperienceResult,
  EXP_PER_LEARNING,
  Phrase,
  LevelReward,
} from '../types';
import { gainExperience, gainExperienceWithAmount, applyExperienceResult } from './experience';
import { saveUserState, checkStreakUpdate, loadUserState } from './storage';
import {
  checkAchievements,
  unlockAchievements,
  checkLevelReward,
  applyLevelReward,
  applyStreakMultiplier,
  generateDailyMissions,
  updateMissionProgress,
} from './gamification';

/**
 * 「覚えた」ボタン押下時の処理（要件対応版）
 * 
 * 要件:
 * - 学習済みIDを保存
 * - 経験値を加算
 * - レベルアップ判定を行う
 * - 処理結果をオブジェクトで返す
 * - LocalStorageに保存
 * 
 * @param phraseId 学習したフレーズID
 * @returns 処理結果オブジェクト
 */
export function markAsLearned(phraseId: number): {
  success: boolean;
  learnedPhraseId: number;
  experienceGained: number;
  leveledUp: boolean;
  newLevel: number;
  newExperience: number;
  userState: UserState;
} {
  // 現在のユーザー状態をLocalStorageから読み込み
  const currentState = loadUserState();
  
  // 既に学習済みかチェック
  const isAlreadyLearned = currentState.learnedPhraseIds.includes(phraseId);
  
  // 学習済みIDを保存（重複チェック）
  const updatedLearnedIds = isAlreadyLearned
    ? currentState.learnedPhraseIds
    : [...currentState.learnedPhraseIds, phraseId];
  
  // 経験値を加算（既に学習済みの場合は加算しない）
  const expGain = isAlreadyLearned ? 0 : EXP_PER_LEARNING;
  const experienceResult = gainExperienceWithAmount(currentState, expGain);
  
  // レベルアップ判定はgainExperience内で行われ、experienceResult.leveledUpに反映される
  
  // 更新されたユーザー状態を構築
  const updatedState: UserState = {
    ...currentState,
    learnedPhraseIds: updatedLearnedIds,
    experience: experienceResult.newExperience,
    level: experienceResult.newLevel,
    totalExp: currentState.totalExp + experienceResult.experienceGained,
  };
  
  // LocalStorageに保存
  const saveSuccess = saveUserState(updatedState);
  
  // 処理結果を返す
  return {
    success: saveSuccess,
    learnedPhraseId: phraseId,
    experienceGained: experienceResult.experienceGained,
    leveledUp: experienceResult.leveledUp,
    newLevel: experienceResult.newLevel,
    newExperience: experienceResult.newExperience,
    userState: updatedState,
  };
}

/**
 * 学習完了処理（フル機能版）
 * ユーザーが「覚えた」ボタンを押したときに呼び出す
 *
 * @param currentState 現在のユーザー状態
 * @param phraseId 学習したフレーズID
 * @param phrase フレーズデータ（実績・ミッション判定用）
 * @param allPhrases 全フレーズデータ（タグ実績判定用）
 * @returns 学習結果オブジェクト
 */
export function completeLearning(
  currentState: UserState,
  phraseId: number,
  phrase?: Phrase,
  allPhrases?: Phrase[]
): LearningResult {
  const oldLevel = currentState.level;

  // 1. 既に学習済みかチェック
  const isNewPhrase = !currentState.learnedPhraseIds.includes(phraseId);

  // 2. 連続学習日数の更新チェック
  const streakCheck = checkStreakUpdate(currentState.lastLearnedAt);
  let newStreak = currentState.streak;
  let streakUpdated = false;

  if (streakCheck.shouldReset) {
    newStreak = 1;
    streakUpdated = true;
  } else if (streakCheck.shouldIncrement) {
    newStreak = currentState.streak + 1;
    streakUpdated = true;
  }

  // 3. 経験値計算（連続学習ボーナス適用）
  let experienceResult: ExperienceResult;

  if (isNewPhrase) {
    const { finalExp, multiplier, bonusExp } = applyStreakMultiplier(
      EXP_PER_LEARNING,
      newStreak
    );

    const baseResult = gainExperienceWithAmount(currentState, finalExp);
    experienceResult = {
      ...baseResult,
      bonusExp,
      streakMultiplier: multiplier,
    };
  } else {
    experienceResult = {
      newExperience: currentState.experience,
      newLevel: currentState.level,
      leveledUp: false,
      experienceGained: 0,
      bonusExp: 0,
      streakMultiplier: 1,
    };
  }

  // 4. 統計を更新
  const today = new Date().toISOString().split('T')[0];
  const isNewDay = currentState.stats.lastActiveDate !== today;

  const updatedStats = {
    ...currentState.stats,
    totalLearned: isNewPhrase
      ? currentState.stats.totalLearned + 1
      : currentState.stats.totalLearned,
    todayLearned: isNewDay
      ? (isNewPhrase ? 1 : 0)
      : (isNewPhrase ? currentState.stats.todayLearned + 1 : currentState.stats.todayLearned),
    lastActiveDate: today,
    tagProgress: phrase
      ? updateTagProgress(currentState.stats.tagProgress, phrase, isNewPhrase)
      : currentState.stats.tagProgress,
  };

  // 5. 新しいユーザー状態を構築
  let updatedState: UserState = {
    ...applyExperienceResult(currentState, experienceResult),
    totalExp: currentState.totalExp + experienceResult.experienceGained,
    learnedPhraseIds: isNewPhrase
      ? [...currentState.learnedPhraseIds, phraseId]
      : currentState.learnedPhraseIds,
    streak: newStreak,
    bestStreak: Math.max(currentState.bestStreak, newStreak),
    lastLearnedAt: new Date().toISOString(),
    stats: updatedStats,
  };

  // 6. デイリーミッション更新
  const dailyMissions = generateDailyMissions(updatedState.dailyMissions);
  const updatedMissions = phrase && isNewPhrase
    ? updateMissionProgress(dailyMissions, phrase)
    : dailyMissions;
  updatedState.dailyMissions = updatedMissions;

  // 7. レベルアップ報酬チェック
  let levelReward: LevelReward | null = null;
  if (experienceResult.leveledUp) {
    levelReward = checkLevelReward(oldLevel, experienceResult.newLevel);
    if (levelReward) {
      updatedState = applyLevelReward(updatedState, levelReward);
    }
  }

  // 8. 実績チェック
  const newAchievements = checkAchievements(updatedState, allPhrases);
  if (newAchievements.length > 0) {
    const { state: achievementState, totalBonusExp } = unlockAchievements(
      updatedState,
      newAchievements
    );
    updatedState = achievementState;

    // 実績ボーナス経験値を追加
    if (totalBonusExp > 0) {
      updatedState.experience += totalBonusExp;
      updatedState.totalExp += totalBonusExp;
      experienceResult.bonusExp += totalBonusExp;
    }
  }

  // 9. LocalStorageに保存
  const saveSuccess = saveUserState(updatedState);

  return {
    success: saveSuccess,
    userState: updatedState,
    experienceResult,
    isNewPhrase,
    streakUpdated,
    newAchievements,
    levelReward,
    missionProgress: updatedMissions.missions,
  };
}

/**
 * タグ別進捗を更新
 */
function updateTagProgress(
  tagProgress: Record<string, number>,
  phrase: Phrase,
  isNewPhrase: boolean
): Record<string, number> {
  if (!isNewPhrase) return tagProgress;

  const updated = { ...tagProgress };
  for (const tag of phrase.tags) {
    updated[tag] = (updated[tag] || 0) + 1;
  }
  return updated;
}

/**
 * 学習済みフレーズを解除（復習用）
 */
export function unlearnPhrase(
  currentState: UserState,
  phraseId: number
): UserState {
  const updatedState: UserState = {
    ...currentState,
    learnedPhraseIds: currentState.learnedPhraseIds.filter(
      (id) => id !== phraseId
    ),
  };

  saveUserState(updatedState);
  return updatedState;
}

/**
 * 学習進捗を取得
 */
export function getLearningProgress(
  state: UserState,
  totalPhrases: number
): {
  learnedCount: number;
  totalCount: number;
  percentage: number;
} {
  const learnedCount = state.learnedPhraseIds.length;
  const percentage =
    totalPhrases > 0 ? Math.round((learnedCount / totalPhrases) * 100) : 0;

  return {
    learnedCount,
    totalCount: totalPhrases,
    percentage,
  };
}

/**
 * 未学習のフレーズIDを取得
 */
export function getUnlearnedPhraseIds(
  state: UserState,
  allPhraseIds: number[]
): number[] {
  return allPhraseIds.filter((id) => !state.learnedPhraseIds.includes(id));
}

/**
 * ランダムな未学習フレーズIDを取得
 */
export function getRandomUnlearnedPhraseId(
  state: UserState,
  allPhraseIds: number[]
): number | null {
  const unlearnedIds = getUnlearnedPhraseIds(state, allPhraseIds);

  if (unlearnedIds.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * unlearnedIds.length);
  return unlearnedIds[randomIndex];
}

/**
 * レベルに応じたフレーズをフィルタ
 */
export function getAccessiblePhrases(
  phrases: Phrase[],
  userLevel: number
): Phrase[] {
  // レベル25未満は初級・中級のみ
  if (userLevel < 25) {
    return phrases.filter((p) => p.level <= 2);
  }
  // レベル25以上は全て
  return phrases;
}
