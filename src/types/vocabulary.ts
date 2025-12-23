/**
 * ボキャブラリー学習システム - 型定義
 */

// カテゴリ定義
export type VocabularyCategory = 
  | 'furniture'    // 家具
  | 'food'         // 食べ物
  | 'animals'      // 動物
  | 'clothes'      // 服
  | 'body'         // 体の部位
  | 'kitchen'      // キッチン用品
  | 'nature'       // 自然
  | 'transport'    // 乗り物
  | 'buildings'    // 建物
  | 'proverbs';    // ことわざ（上級）

// ボキャブラリーアイテム
export interface VocabularyItem {
  id: number;
  word: string;           // 日本語
  reading: string;        // 読み仮名
  meaning: string;        // 英語/説明
  image: string;          // 画像URL（絵文字 or 実際の画像）
  category: VocabularyCategory;
  rank: number;           // 解放されるランク
}

// ランク/ステージ定義
export interface Rank {
  level: number;
  name: string;
  category: VocabularyCategory;
  description: string;
  requiredScore: number;  // クイズ合格に必要なスコア（%）
  icon: string;
  color: string;
}

// クイズの問題タイプ
export type QuizType = 
  | 'image_to_word'      // 画像を見て単語を選ぶ
  | 'word_to_image'      // 単語を見て画像を選ぶ
  | 'reading'            // 読み方を選ぶ
  | 'listening';         // 音声を聞いて選ぶ（将来用）

// クイズの問題
export interface QuizQuestion {
  id: string;
  type: QuizType;
  vocabularyId: number;
  question: string;       // 問題文
  correctAnswer: string;  // 正解
  options: string[];      // 選択肢
  image?: string;         // 画像（image_to_word用）
}

// クイズセッション
export interface QuizSession {
  rankLevel: number;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
  startedAt: string;
  completedAt: string | null;
}

// クイズ結果
export interface QuizResult {
  rankLevel: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;          // パーセンテージ
  passed: boolean;
  expEarned: number;
  newRankUnlocked: boolean;
}

// ユーザーのランク進捗
export interface RankProgress {
  currentRank: number;
  highestUnlockedRank: number;
  rankScores: Record<number, number>;  // 各ランクの最高スコア
  quizAttempts: Record<number, number>; // 各ランクの挑戦回数
}

// 学習状態（拡張）
export interface VocabularyLearningState {
  learnedIds: number[];           // 学習済みボキャブラリーID
  masteredIds: number[];          // マスター済み（クイズで正解）
  currentCategory: VocabularyCategory;
  rankProgress: RankProgress;
}

