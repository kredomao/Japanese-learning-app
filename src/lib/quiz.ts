/**
 * クイズ機能
 * ボキャブラリー学習の確認テスト
 */

import {
  QuizQuestion,
  QuizSession,
  QuizResult,
  QuizType,
  VocabularyItem,
  RankProgress,
} from '../types/vocabulary';
import { getVocabularyByRank, getRankInfo } from '../data/vocabulary';

// ============================================
// 🎯 クイズ生成
// ============================================

/**
 * 配列をシャッフル
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * ランダムな選択肢を生成（正解を含む4択）
 */
function generateOptions(
  correctAnswer: string,
  allAnswers: string[],
  count: number = 4
): string[] {
  const otherAnswers = allAnswers.filter((a) => a !== correctAnswer);
  const shuffledOthers = shuffleArray(otherAnswers);
  const wrongOptions = shuffledOthers.slice(0, count - 1);
  const options = shuffleArray([correctAnswer, ...wrongOptions]);
  return options;
}

/**
 * 画像→単語クイズを生成
 */
function createImageToWordQuestion(
  vocab: VocabularyItem,
  allVocab: VocabularyItem[]
): QuizQuestion {
  const allWords = allVocab.map((v) => v.word);
  const options = generateOptions(vocab.word, allWords);

  return {
    id: `q_${vocab.id}_itw_${Date.now()}`,
    type: 'image_to_word',
    vocabularyId: vocab.id,
    question: 'この画像は何ですか？',
    correctAnswer: vocab.word,
    options,
    image: vocab.image,
  };
}

/**
 * 単語→画像クイズを生成
 */
function createWordToImageQuestion(
  vocab: VocabularyItem,
  allVocab: VocabularyItem[]
): QuizQuestion {
  const allImages = allVocab.map((v) => v.image);
  const options = generateOptions(vocab.image, allImages);

  return {
    id: `q_${vocab.id}_wti_${Date.now()}`,
    type: 'word_to_image',
    vocabularyId: vocab.id,
    question: `「${vocab.word}」はどれですか？`,
    correctAnswer: vocab.image,
    options,
  };
}

/**
 * 読み方クイズを生成（画像を見て単語を選ぶ形式）
 */
function createReadingQuestion(
  vocab: VocabularyItem,
  allVocab: VocabularyItem[]
): QuizQuestion {
  const allWords = allVocab.map((v) => v.word);
  const options = generateOptions(vocab.word, allWords);

  return {
    id: `q_${vocab.id}_read_${Date.now()}`,
    type: 'reading',
    vocabularyId: vocab.id,
    question: 'これは何でしょう？',
    correctAnswer: vocab.word,
    options,
    image: vocab.image,
  };
}

/**
 * ランク用のクイズセッションを生成
 */
export function generateQuizSession(rankLevel: number): QuizSession | null {
  const vocabulary = getVocabularyByRank(rankLevel);
  
  if (vocabulary.length === 0) {
    return null;
  }

  const questions: QuizQuestion[] = [];
  const quizTypes: QuizType[] = ['image_to_word', 'word_to_image', 'reading'];

  // 各単語につき1問ずつ、ランダムなタイプで出題
  const shuffledVocab = shuffleArray(vocabulary);
  
  shuffledVocab.forEach((vocab, index) => {
    const type = quizTypes[index % quizTypes.length];
    
    switch (type) {
      case 'image_to_word':
        questions.push(createImageToWordQuestion(vocab, vocabulary));
        break;
      case 'word_to_image':
        questions.push(createWordToImageQuestion(vocab, vocabulary));
        break;
      case 'reading':
        questions.push(createReadingQuestion(vocab, vocabulary));
        break;
    }
  });

  return {
    rankLevel,
    questions: shuffleArray(questions),
    currentIndex: 0,
    answers: [],
    startedAt: new Date().toISOString(),
    completedAt: null,
  };
}

// ============================================
// 📊 クイズ結果処理
// ============================================

/**
 * クイズの結果を計算
 */
export function calculateQuizResult(
  session: QuizSession,
  rankProgress: RankProgress
): QuizResult {
  const totalQuestions = session.questions.length;
  const correctAnswers = session.answers.filter((a) => a.isCorrect).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const rankInfo = getRankInfo(session.rankLevel);
  const requiredScore = rankInfo?.requiredScore || 70;
  const passed = score >= requiredScore;

  // 経験値計算（正解数 × 10 + 合格ボーナス）
  let expEarned = correctAnswers * 10;
  if (passed) {
    expEarned += 50; // 合格ボーナス
  }

  // 新ランク解放判定（100%正解、または合格点を超えて現在のランクが解放されている最大ランクと同じ場合）
  const newRankUnlocked = passed && session.rankLevel === rankProgress.highestUnlockedRank;

  return {
    rankLevel: session.rankLevel,
    totalQuestions,
    correctAnswers,
    score,
    passed,
    expEarned,
    newRankUnlocked,
  };
}

/**
 * 回答を記録
 */
export function recordAnswer(
  session: QuizSession,
  selectedAnswer: string
): QuizSession {
  const currentQuestion = session.questions[session.currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const newAnswers = [
    ...session.answers,
    {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
    },
  ];

  const isComplete = session.currentIndex >= session.questions.length - 1;

  return {
    ...session,
    answers: newAnswers,
    currentIndex: isComplete ? session.currentIndex : session.currentIndex + 1,
    completedAt: isComplete ? new Date().toISOString() : null,
  };
}

/**
 * クイズが完了したかチェック
 */
export function isQuizComplete(session: QuizSession): boolean {
  return session.answers.length >= session.questions.length;
}

/**
 * 現在の問題を取得
 */
export function getCurrentQuestion(session: QuizSession): QuizQuestion | null {
  if (session.currentIndex >= session.questions.length) {
    return null;
  }
  return session.questions[session.currentIndex];
}

// ============================================
// 🏆 ランク進捗管理
// ============================================

/**
 * 初期ランク進捗
 */
export const initialRankProgress: RankProgress = {
  currentRank: 1,
  highestUnlockedRank: 1,
  rankScores: {},
  quizAttempts: {},
};

/**
 * ランク進捗を更新
 */
export function updateRankProgress(
  progress: RankProgress,
  result: QuizResult
): RankProgress {
  const newProgress = { ...progress };

  // 最高スコアを更新
  const currentBest = progress.rankScores[result.rankLevel] || 0;
  if (result.score > currentBest) {
    newProgress.rankScores = {
      ...progress.rankScores,
      [result.rankLevel]: result.score,
    };
  }

  // 挑戦回数を更新
  newProgress.quizAttempts = {
    ...progress.quizAttempts,
    [result.rankLevel]: (progress.quizAttempts[result.rankLevel] || 0) + 1,
  };

  // 合格したら次のランクを解放
  // 現在のランクが解放されている最大ランクと同じ場合に、次のランクを解放
  if (result.passed && result.rankLevel === progress.highestUnlockedRank) {
    const nextRank = result.rankLevel + 1;
    // 次のランクが存在する場合のみ解放（最大ランクは10）
    if (nextRank <= 10) {
      newProgress.highestUnlockedRank = nextRank;
    }
  }

  return newProgress;
}

/**
 * ランクが解放されているかチェック
 */
export function isRankUnlocked(rank: number, progress: RankProgress): boolean {
  return rank <= progress.highestUnlockedRank;
}

/**
 * クイズに挑戦可能かチェック（全単語を学習済みか）
 */
export function canAttemptQuiz(
  rankLevel: number,
  learnedIds: number[]
): boolean {
  const vocabulary = getVocabularyByRank(rankLevel);
  // 単語が存在し、かつ全て学習済みの場合のみクイズに挑戦可能
  if (vocabulary.length === 0) return false;
  return vocabulary.every((v) => learnedIds.includes(v.id));
}

