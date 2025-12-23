/**
 * ライブラリ関数のエクスポート
 */

// 経験値・レベル関連
export {
  getRequiredExpForLevel,
  getExpProgress,
  canLevelUp,
  gainExperience,
  applyExperienceResult,
  getLevelTitle,
} from './experience';

// ストレージ関連
export {
  initialUserState,
  loadUserState,
  saveUserState,
  resetUserState,
  checkStreakUpdate,
} from './storage';

// 学習処理関連
export {
  completeLearning,
  unlearnPhrase,
  getLearningProgress,
  getUnlearnedPhraseIds,
  getRandomUnlearnedPhraseId,
  getAccessiblePhrases,
} from './learning';

// ゲーミフィケーション関連
export {
  checkAchievements,
  unlockAchievements,
  markAchievementNotified,
  checkLevelReward,
  applyLevelReward,
  getCurrentStreakBonus,
  getNextStreakMilestone,
  applyStreakMultiplier,
  generateDailyMissions,
  getDailyMissionDetails,
  updateMissionProgress,
  claimMissionReward,
  getAchievementProgress,
  getUpcomingAchievements,
} from './gamification';
