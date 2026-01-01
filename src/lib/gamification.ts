/**
 * ゲーミフィケーションロジック
 * 🎮 実績・報酬・ミッション管理
 */

import {
  UserState,
  Achievement,
  UnlockedAchievement,
  LevelReward,
  STREAK_BONUSES,
  StreakBonus,
  DailyMission,
  MissionProgress,
  DailyMissionState,
  Phrase,
} from '../types';
import {
  ACHIEVEMENTS,
  LEVEL_REWARDS,
  DAILY_MISSION_TEMPLATES,
  getLevelReward,
} from '../data/achievements';

// ============================================
// 🏆 実績チェック
// ============================================

/**
 * ユーザー状態に基づいて解除可能な実績をチェック
 */
export function checkAchievements(
  state: UserState,
  phrases?: Phrase[]
): Achievement[] {
  const unlockedIds = new Set(state.unlockedAchievements.map((a) => a.achievementId));
  const newAchievements: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // 既に解除済みならスキップ
    if (unlockedIds.has(achievement.id)) continue;

    const isUnlocked = checkAchievementCondition(achievement, state, phrases);
    if (isUnlocked) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

/**
 * 実績条件をチェック
 */
function checkAchievementCondition(
  achievement: Achievement,
  state: UserState,
  phrases?: Phrase[]
): boolean {
  const { condition } = achievement;

  switch (condition.type) {
    case 'learned_count':
      return state.learnedPhraseIds.length >= condition.value;

    case 'streak':
      return state.streak >= condition.value;

    case 'level':
      return state.level >= condition.value;

    case 'total_exp':
      return state.totalExp >= condition.value;

    case 'tag_mastery':
      if (!phrases || !condition.tag) return false;
      const tagPhrases = phrases.filter((p) => p.tags.includes(condition.tag!));
      const learnedTagCount = tagPhrases.filter((p) =>
        state.learnedPhraseIds.includes(p.id)
      ).length;
      return learnedTagCount >= condition.value;

    default:
      return false;
  }
}

/**
 * 実績を解除して状態を更新
 */
export function unlockAchievements(
  state: UserState,
  achievements: Achievement[]
): { state: UserState; totalBonusExp: number } {
  if (achievements.length === 0) {
    return { state, totalBonusExp: 0 };
  }

  let totalBonusExp = 0;
  const newUnlocked: UnlockedAchievement[] = [];
  const newTitles: string[] = [];

  for (const achievement of achievements) {
    newUnlocked.push({
      achievementId: achievement.id,
      unlockedAt: new Date().toISOString(),
      notified: false,
    });

    totalBonusExp += achievement.reward.exp;

    if (achievement.reward.title) {
      newTitles.push(achievement.reward.title);
    }
  }

  return {
    state: {
      ...state,
      unlockedAchievements: [...state.unlockedAchievements, ...newUnlocked],
      unlockedTitles: [...state.unlockedTitles, ...newTitles],
    },
    totalBonusExp,
  };
}

/**
 * 実績の通知済みフラグを更新
 */
export function markAchievementNotified(
  state: UserState,
  achievementId: string
): UserState {
  return {
    ...state,
    unlockedAchievements: state.unlockedAchievements.map((a) =>
      a.achievementId === achievementId ? { ...a, notified: true } : a
    ),
  };
}

// ============================================
// 🎁 レベルアップ報酬
// ============================================

/**
 * レベルアップ報酬を取得
 */
export function checkLevelReward(
  oldLevel: number,
  newLevel: number
): LevelReward | null {
  if (newLevel <= oldLevel) return null;

  // レベルアップした範囲で最高の報酬を探す
  let bestReward: LevelReward | null = null;
  for (let level = oldLevel + 1; level <= newLevel; level++) {
    const reward = getLevelReward(level);
    if (reward) {
      bestReward = reward;
    }
  }

  return bestReward;
}

/**
 * レベルアップ報酬を適用
 */
export function applyLevelReward(
  state: UserState,
  reward: LevelReward
): UserState {
  let newState = state;

  if (reward.title) {
    newState = {
      ...newState,
      currentTitle: reward.title,
      unlockedTitles: newState.unlockedTitles.includes(reward.title)
        ? newState.unlockedTitles
        : [...newState.unlockedTitles, reward.title],
    };
  }

  if (reward.bonusExp) {
    newState = {
      ...newState,
      experience: newState.experience + reward.bonusExp,
      totalExp: newState.totalExp + reward.bonusExp,
    };
  }

  return newState;
}

// ============================================
// 🔥 連続学習ボーナス
// ============================================

/**
 * 現在の連続学習ボーナスを取得
 */
export function getCurrentStreakBonus(streak: number): StreakBonus | null {
  // 降順でチェックして、最も高いボーナスを返す
  for (let i = STREAK_BONUSES.length - 1; i >= 0; i--) {
    if (streak >= STREAK_BONUSES[i].days) {
      return STREAK_BONUSES[i];
    }
  }
  return null;
}

/**
 * 次の連続学習マイルストーンを取得
 */
export function getNextStreakMilestone(streak: number): StreakBonus | null {
  for (const bonus of STREAK_BONUSES) {
    if (streak < bonus.days) {
      return bonus;
    }
  }
  return null; // 全て達成済み
}

/**
 * 経験値に連続学習倍率を適用
 */
export function applyStreakMultiplier(baseExp: number, streak: number): {
  finalExp: number;
  multiplier: number;
  bonusExp: number;
} {
  const streakBonus = getCurrentStreakBonus(streak);

  if (!streakBonus) {
    return { finalExp: baseExp, multiplier: 1, bonusExp: 0 };
  }

  const multipliedExp = Math.floor(baseExp * streakBonus.expMultiplier);
  const bonusExp = multipliedExp - baseExp;

  return {
    finalExp: multipliedExp,
    multiplier: streakBonus.expMultiplier,
    bonusExp,
  };
}

// ============================================
// 📋 デイリーミッション
// ============================================

/**
 * 今日のミッションを生成
 */
export function generateDailyMissions(
  existingState: DailyMissionState | null
): DailyMissionState {
  const today = new Date().toISOString().split('T')[0];

  // 既に今日のミッションがあればそのまま返す
  if (existingState && existingState.date === today) {
    return existingState;
  }

  // 新しいミッションを生成（ランダムに3つ選択）
  const shuffled = [...DAILY_MISSION_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  const missions: MissionProgress[] = selected.map((template, index) => ({
    missionId: `daily_${today}_${index}`,
    current: 0,
    completed: false,
    claimedAt: null,
  }));

  return {
    date: today,
    missions,
  };
}

/**
 * ミッションテンプレートを取得
 */
export function getDailyMissionDetails(
  missionState: DailyMissionState
): (DailyMission & { progress: MissionProgress })[] {
  const today = missionState.date;

  return missionState.missions.map((progress, index) => {
    const templateIndex = parseInt(progress.missionId.split('_')[2]) || index;
    const template = DAILY_MISSION_TEMPLATES[templateIndex % DAILY_MISSION_TEMPLATES.length];

    return {
      id: progress.missionId,
      ...template,
      progress,
    };
  });
}

/**
 * ミッション進捗を更新（ことわざ学習用）
 */
export function updateMissionProgress(
  state: DailyMissionState,
  learnedPhrase: Phrase
): DailyMissionState {
  const updatedMissions = state.missions.map((mission, index) => {
    if (mission.completed) return mission;

    const templateIndex = parseInt(mission.missionId.split('_')[2]) || index;
    const template = DAILY_MISSION_TEMPLATES[templateIndex % DAILY_MISSION_TEMPLATES.length];

    let shouldIncrement = false;

    if (template.type === 'learn_count') {
      shouldIncrement = true;
    } else if (template.type === 'learn_tag' && template.tag) {
      shouldIncrement = learnedPhrase.tags.includes(template.tag);
    }

    if (shouldIncrement) {
      const newCurrent = mission.current + 1;
      return {
        ...mission,
        current: newCurrent,
        completed: newCurrent >= template.target,
      };
    }

    return mission;
  });

  return {
    ...state,
    missions: updatedMissions,
  };
}

/**
 * ミッション進捗を更新（ボキャブラリー学習用）
 */
export function updateMissionProgressForVocabulary(
  state: DailyMissionState,
  category: string
): DailyMissionState {
  const updatedMissions = state.missions.map((mission, index) => {
    if (mission.completed) return mission;

    const templateIndex = parseInt(mission.missionId.split('_')[2]) || index;
    const template = DAILY_MISSION_TEMPLATES[templateIndex % DAILY_MISSION_TEMPLATES.length];

    let shouldIncrement = false;

    if (template.type === 'learn_count') {
      shouldIncrement = true;
    } else if (template.type === 'learn_category' && template.category) {
      shouldIncrement = category === template.category;
    }

    if (shouldIncrement) {
      const newCurrent = mission.current + 1;
      return {
        ...mission,
        current: newCurrent,
        completed: newCurrent >= template.target,
      };
    }

    return mission;
  });

  return {
    ...state,
    missions: updatedMissions,
  };
}

/**
 * ミッション報酬を受け取る
 */
export function claimMissionReward(
  state: DailyMissionState,
  missionId: string
): { state: DailyMissionState; reward: number } {
  let rewardExp = 0;

  const updatedMissions = state.missions.map((mission, index) => {
    if (mission.missionId !== missionId) return mission;
    if (!mission.completed || mission.claimedAt) return mission;

    const templateIndex = parseInt(mission.missionId.split('_')[2]) || index;
    const template = DAILY_MISSION_TEMPLATES[templateIndex % DAILY_MISSION_TEMPLATES.length];
    rewardExp = template.reward.exp;

    return {
      ...mission,
      claimedAt: new Date().toISOString(),
    };
  });

  return {
    state: { ...state, missions: updatedMissions },
    reward: rewardExp,
  };
}

// ============================================
// 📊 統計・進捗
// ============================================

/**
 * 実績の進捗率を計算
 */
export function getAchievementProgress(state: UserState): {
  unlocked: number;
  total: number;
  percentage: number;
  byCategory: Record<string, { unlocked: number; total: number }>;
} {
  const unlocked = state.unlockedAchievements.length;
  const total = ACHIEVEMENTS.length;

  const byCategory: Record<string, { unlocked: number; total: number }> = {};

  for (const achievement of ACHIEVEMENTS) {
    if (!byCategory[achievement.category]) {
      byCategory[achievement.category] = { unlocked: 0, total: 0 };
    }
    byCategory[achievement.category].total++;

    if (state.unlockedAchievements.some((a) => a.achievementId === achievement.id)) {
      byCategory[achievement.category].unlocked++;
    }
  }

  return {
    unlocked,
    total,
    percentage: Math.round((unlocked / total) * 100),
    byCategory,
  };
}

/**
 * 次に解除できそうな実績を取得
 */
export function getUpcomingAchievements(
  state: UserState,
  limit: number = 3
): { achievement: Achievement; progress: number; target: number }[] {
  const unlockedIds = new Set(state.unlockedAchievements.map((a) => a.achievementId));
  const upcoming: { achievement: Achievement; progress: number; target: number }[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.has(achievement.id)) continue;

    let progress = 0;
    const target = achievement.condition.value;

    switch (achievement.condition.type) {
      case 'learned_count':
        progress = state.learnedPhraseIds.length;
        break;
      case 'streak':
        progress = state.streak;
        break;
      case 'level':
        progress = state.level;
        break;
      case 'total_exp':
        progress = state.totalExp;
        break;
      default:
        continue;
    }

    // 進捗がある程度ある実績のみ
    if (progress > 0) {
      upcoming.push({ achievement, progress, target });
    }
  }

  // 完了に近い順にソート
  upcoming.sort((a, b) => (b.progress / b.target) - (a.progress / a.target));

  return upcoming.slice(0, limit);
}

