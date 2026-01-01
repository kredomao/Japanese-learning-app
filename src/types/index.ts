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
  meaningCategory?: MeaningCategory; // 意味カテゴリ（画像表示用・オプション）
  image?: PhraseImage; // 学習補助画像（オプション・個別画像は使用しない）
}

// 意味カテゴリ（画像表示用）
export type MeaningCategory =
  | 'persistence'        // 努力・継続系
  | 'failure-learning'   // 失敗・学習系
  | 'wisdom-decision'    // 知恵・判断系
  | 'action-challenge'   // 行動・挑戦系
  | 'daily-life'         // 生活・習慣系
  | 'relationship-growth' // 関係・成長系
  | 'character-attitude' // 品格・態度系
  | 'life-encounter';    // 人生・出会い系

// 意味カテゴリの定義
export interface MeaningCategoryDefinition {
  id: MeaningCategory;
  name: string;              // カテゴリ名（日本語）
  nameEn: string;            // カテゴリ名（英語）
  description: string;        // カテゴリの説明
  imageConcept: string;       // 画像のコンセプト
  searchKeywords: string[];   // 検索キーワード
  imageUrl?: string;          // 共通画像URL
  imageAlt?: string;          // 画像の代替テキスト
}

// 学習補助画像の定義
export interface PhraseImage {
  url: string;         // 画像URL（ローカルパス or 外部URL）
  alt: string;        // 代替テキスト（アクセシビリティ用）
  description: string; // 画像の説明（意味との対応関係）
  source?: 'local' | 'external' | 'generated'; // 画像のソース
  attribution?: ImageAttribution; // 画像の出典情報（フリー素材の場合）
}

// 画像の出典情報（フリー素材の場合）
export interface ImageAttribution {
  author: string;     // 作者名
  source: 'unsplash' | 'pexels' | 'pixabay' | 'other'; // ソース
  sourceUrl?: string; // ソースURL
  license?: string;    // ライセンス情報
}

// 画像選定情報（選定プロセスを記録）
export interface ImageSelectionInfo {
  phraseId: number;
  meaning: string;                    // 具体的な意味
  realWorldSituation: string;          // 現実世界の状況
  searchKeywords: string[];            // 検索キーワード
  selectedImageUrl: string;            // 選定した画像URL
  selectionReason: string;             // 選定理由
  rejectedReasons: string[];           // 選ばなかった理由
  selectedAt: string;                  // 選定日時（ISO形式）
  selectedBy?: string;                 // 選定者
}

// 画像選定ガイドライン（開発者向け）
export interface ImageSelectionGuide {
  purpose: string;              // 画像の目的（何を理解させるか）
  requiredElements: string[];    // 含めるべき要素
  forbiddenElements: string[];   // 絶対に含めてはいけない要素
  recommendedType: 'photo' | 'illustration'; // 推奨タイプ
  notes?: string;                // 補足説明
}

/**
 * 画像生成・選定時の禁止表現（全フレーズ共通）
 * これらの表現は絶対に使用しないでください
 */
export const FORBIDDEN_IMAGE_EXPRESSIONS = [
  'かわいい',
  'キャラクター',
  'デフォルメ',
  'ファンタジー',
  '面白おかしい',
  '抽象的',
  'メタファーのみで表現',
] as const;

/**
 * 画像生成・選定時の必須要件（全フレーズ共通）
 */
export const REQUIRED_IMAGE_REQUIREMENTS = [
  '現実に近い状況を描写する',
  '実写写真または現実的なイラストのみ',
  '装飾的要素は一切含めない',
] as const;

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
  | 'learn_tag'        // 特定タグを学習（ことわざ用）
  | 'learn_category'   // 特定カテゴリを学習（ボキャブラリー用）
  | 'review'           // 復習
  | 'perfect_streak';  // 連続正解（クイズ用）

export interface DailyMission {
  id: string;
  type: MissionType;
  description: string;
  target: number;
  tag?: string;           // ことわざのタグ（learn_tag用）
  category?: string;      // ボキャブラリーのカテゴリ（learn_category用）
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

