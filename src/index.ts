/**
 * 日本語学習アプリ - メインエクスポート
 *
 * 使用例:
 * import { usePhraselearning, useAchievements, useAILearning, Phrase } from './src';
 * import phrases from './src/data/phrases.json';
 */

// 型定義
export type {
  Phrase,
  MeaningCategory,
  MeaningCategoryDefinition,
  UserState,
  ExperienceResult,
  LearningResult,
  Achievement,
  AchievementCategory,
  UnlockedAchievement,
  LevelReward,
  StreakBonus,
  DailyMission,
  MissionProgress,
  DailyMissionState,
  MissionType,
  UserStats,
} from './types';

export { EXP_PER_LEARNING, EXP_MULTIPLIER, STREAK_BONUSES } from './types';

// AI型定義
export type {
  GenerateExampleRequest,
  GenerateExampleResponse,
  GeneratedExample,
  ExplainPhraseRequest,
  ExplainPhraseResponse,
  AIServiceConfig,
  ConversationExample,
} from './types/ai';

// ライブラリ関数
export * from './lib';

// AIサービス（サーバーサイド用）
export {
  generateExamples,
  explainPhrase,
  callOpenAI,
  prompts,
} from './lib/ai-service';

// React Hooks
export {
  useUserState,
  usePhraselearning,
  useAchievements,
} from './hooks/useUserState';

// AI Hooks
export {
  useExampleGenerator,
  usePhraseExplainer,
  useCachedExampleGenerator,
  useAILearning,
} from './hooks/useAI';

// データ
export {
  ACHIEVEMENTS,
  LEVEL_REWARDS,
  DAILY_MISSION_TEMPLATES,
  getAchievementById,
  getLevelReward,
  getRarityColor,
  getRarityName,
} from './data/achievements';
// ボキャブラリー型定義
export type {
  VocabularyItem,
  VocabularyCategory,
  Rank,
  QuizQuestion,
  QuizSession,
  QuizResult,
  QuizType,
  RankProgress,
  VocabularyLearningState,
} from './types/vocabulary';

// ボキャブラリーデータ
export {
  VOCABULARY,
  RANKS,
  getVocabularyByRank,
  getVocabularyByCategory,
  getRankInfo,
  getUnlockedVocabulary,
} from './data/vocabulary';

// 意味カテゴリデータ
export {
  MEANING_CATEGORIES,
  getMeaningCategory,
  getAllMeaningCategories,
} from './data/meaning-categories';

// クイズ機能
export {
  generateQuizSession,
  recordAnswer,
  calculateQuizResult,
  updateRankProgress,
  isQuizComplete,
  getCurrentQuestion,
  initialRankProgress,
  canAttemptQuiz,
} from './lib/quiz';

// ボキャブラリーHooks
export {
  useVocabularyLearning,
  useQuiz,
} from './hooks/useVocabulary';
