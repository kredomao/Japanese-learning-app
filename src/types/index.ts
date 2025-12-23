/**
 * 日本語学習アプリ - 型定義
 */

// ことわざ・言い回しデータの型
export interface Phrase {
  id: number;
  phrase: string;      // ことわざ・言い回し本文
  reading: string;     // 読み仮名
  meaning: string;     // 意味・解説
  example: string;     // 例文
  level: number;       // 難易度レベル (1-5)
  tags: string[];      // タグ（カテゴリ分類用）
}

// ============================================
// 🎮 ゲーミフィケーション - 実績システム
// ============================================

// 実績の種類
export type AchievementCategory =
  | 'learning'    // 学習系
  | 'streak'      // 連続学習系
  | 'level'       // レベル系
  | 'collection'  // コレクション系
  | 'special';    // 特別

// 実績の定義
export interface Achievement {
  id: string;
  name: string;           // 実績名
  description: string;    // 説明
  icon: string;           // 絵文字アイコン
  category: AchievementCategory;
  condition: {
    type: 'learned_count' | 'streak' | 'level' | 'total_exp' | 'tag_mastery';
    value: number;
    tag?: string;         // tag_mastery用
  };
  reward: {
    exp: number;          // ボーナス経験値
    title?: string;       // 称号獲得
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// 解除済み実績の記録
export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;     // ISO形式
  notified: boolean;      // UI通知済みか
}

// ============================================
// 🎁 報酬システム
// ============================================

// レベルアップ報酬
export interface LevelReward {
  level: number;
  title?: string;         // 新しい称号
  bonusExp?: number;      // ボーナス経験値
  unlocksFeature?: string; // 解放される機能
  message: string;        // お祝いメッセージ
}

// 連続学習ボーナス
export interface StreakBonus {
  days: number;
  expMultiplier: number;  // 経験値倍率
  bonusExp: number;       // 追加ボーナス
  message: string;
}

// ============================================
// 📋 デイリーミッション
// ============================================

export type MissionType =
  | 'learn_count'      // N個学習
  | 'learn_tag'        // 特定タグを学習
  | 'review'           // 復習
  | 'perfect_streak';  // 連続正解（クイズ用）

export interface DailyMission {
  id: string;
  type: MissionType;
  description: string;
  target: number;
  tag?: string;
  reward: {
    exp: number;
  };
}

export interface MissionProgress {
  missionId: string;
  current: number;
  completed: boolean;
  claimedAt: string | null;
}

export interface DailyMissionState {
  date: string;           // 日付（YYYY-MM-DD）
  missions: MissionProgress[];
}

// ============================================
// 👤 ユーザー状態（拡張版）
// ============================================

export interface UserState {
  // 基本ステータス
  level: number;
  experience: number;
  totalExp: number;             // 累計経験値（追加）
  learnedPhraseIds: number[];
  
  // 連続学習
  streak: number;
  bestStreak: number;           // 最高記録（追加）
  lastLearnedAt: string | null;
  
  // ゲーミフィケーション
  unlockedAchievements: UnlockedAchievement[];
  currentTitle: string;         // 現在の称号
  unlockedTitles: string[];     // 解放済み称号
  
  // デイリーミッション
  dailyMissions: DailyMissionState | null;
  
  // 統計
  stats: UserStats;
}

export interface UserStats {
  totalLearned: number;         // 累計学習数
  todayLearned: number;         // 今日の学習数
  lastActiveDate: string | null;
  tagProgress: Record<string, number>; // タグ別学習数
}

// ============================================
// 📊 結果型
// ============================================

export interface ExperienceResult {
  newExperience: number;
  newLevel: number;
  leveledUp: boolean;
  experienceGained: number;
  bonusExp: number;             // ボーナス経験値（追加）
  streakMultiplier: number;     // 連続学習倍率（追加）
}

export interface LearningResult {
  success: boolean;
  userState: UserState;
  experienceResult: ExperienceResult;
  isNewPhrase: boolean;
  streakUpdated: boolean;
  
  // ゲーミフィケーション結果
  newAchievements: Achievement[];
  levelReward: LevelReward | null;
  missionProgress: MissionProgress[];
}

// ============================================
// ⚙️ 定数
// ============================================

export const EXP_PER_LEARNING = 10;
export const EXP_MULTIPLIER = 100;

// 連続学習ボーナス定義
export const STREAK_BONUSES: StreakBonus[] = [
  { days: 3, expMultiplier: 1.1, bonusExp: 5, message: '3日連続！調子いいね！🔥' },
  { days: 7, expMultiplier: 1.2, bonusExp: 20, message: '1週間連続！すごい！🌟' },
  { days: 14, expMultiplier: 1.3, bonusExp: 50, message: '2週間達成！継続は力なり！💪' },
  { days: 30, expMultiplier: 1.5, bonusExp: 100, message: '1ヶ月継続！あなたは本物だ！🏆' },
  { days: 100, expMultiplier: 2.0, bonusExp: 500, message: '100日達成！伝説の学習者！👑' },
];

