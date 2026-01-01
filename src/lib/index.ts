/**
 * ライブラリ関数のエクスポート
 */

// 経験値・レベル関連
export {
  getRequiredExpForLevel,
  getExpProgress,
  canLevelUp,
  checkLevelUp,
  gainExperience,
  gainExperienceWithAmount,
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
  markAsLearned,
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
  updateMissionProgressForVocabulary,
  claimMissionReward,
  getAchievementProgress,
  getUpcomingAchievements,
} from './gamification';

// 画像選定関連
export {
  getImageGuide,
  validateImage,
  generateImageDescription,
  generateImageCaption,
  generateImageAlt,
  getForbiddenExpressionsForPrompt,
  getRequiredRequirementsForPrompt,
  generateImagePrompt,
  getImageReviewChecklist,
  PHRASE_IMAGE_GUIDES,
  FORBIDDEN_EXPRESSIONS,
  REQUIRED_REQUIREMENTS,
  type ImageReviewResult,
} from './image-selection';

// 画像リサーチ関連
export {
  generateSearchKeywords,
  generateImageSelectionTemplate,
  generateSearchUrls,
} from './image-research';

// 意味カテゴリ画像関連
export {
  getCategoryImageUrl,
  getCategoryImageAlt,
  getCategoryImageCaption,
  getPhraseCategory,
} from './category-image';
