/**
 * ボキャブラリー学習用 React Hooks
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  VocabularyItem,
  VocabularyLearningState,
  QuizSession,
  QuizResult,
  RankProgress,
} from '../types/vocabulary';
import {
  VOCABULARY,
  RANKS,
  getVocabularyByRank,
  getRankInfo,
} from '../data/vocabulary';
import {
  generateQuizSession,
  recordAnswer,
  calculateQuizResult,
  updateRankProgress,
  isQuizComplete,
  getCurrentQuestion,
  initialRankProgress,
  canAttemptQuiz,
} from '../lib/quiz';

// LocalStorage キー
const VOCAB_STATE_KEY = 'japanese-learning-vocab-state';

// 初期状態
const initialVocabState: VocabularyLearningState = {
  learnedIds: [],
  masteredIds: [],
  currentCategory: 'furniture',
  rankProgress: initialRankProgress,
};

/**
 * LocalStorageから状態を読み込み
 */
function loadVocabState(): VocabularyLearningState {
  if (typeof window === 'undefined') return initialVocabState;
  
  try {
    const stored = localStorage.getItem(VOCAB_STATE_KEY);
    if (!stored) return initialVocabState;
    return { ...initialVocabState, ...JSON.parse(stored) };
  } catch {
    return initialVocabState;
  }
}

/**
 * LocalStorageに状態を保存
 */
function saveVocabState(state: VocabularyLearningState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VOCAB_STATE_KEY, JSON.stringify(state));
}

/**
 * ボキャブラリー学習フック
 */
export function useVocabularyLearning() {
  const [state, setState] = useState<VocabularyLearningState>(initialVocabState);
  const [isLoading, setIsLoading] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // 初期化
  useEffect(() => {
    const loaded = loadVocabState();
    setState(loaded);
    setIsLoading(false);
  }, []);

  // 現在のランクのボキャブラリー
  const currentRankVocabulary = useMemo(() => {
    return getVocabularyByRank(state.rankProgress.currentRank);
  }, [state.rankProgress.currentRank]);

  // 現在のアイテム
  const currentItem = useMemo(() => {
    const unlearned = currentRankVocabulary.filter(
      (v) => !state.learnedIds.includes(v.id)
    );
    if (unlearned.length === 0) return null;
    return unlearned[currentItemIndex % unlearned.length] || unlearned[0];
  }, [currentRankVocabulary, state.learnedIds, currentItemIndex]);

  // 現在のランク情報
  const currentRankInfo = useMemo(() => {
    return getRankInfo(state.rankProgress.currentRank);
  }, [state.rankProgress.currentRank]);

  // 学習進捗
  const progress = useMemo(() => {
    const total = currentRankVocabulary.length;
    const learned = currentRankVocabulary.filter((v) =>
      state.learnedIds.includes(v.id)
    ).length;
    return {
      learned,
      total,
      percentage: total > 0 ? Math.round((learned / total) * 100) : 0,
    };
  }, [currentRankVocabulary, state.learnedIds]);

  // 単語を学習済みにする
  const markAsLearned = useCallback((itemId: number) => {
    setState((prev) => {
      if (prev.learnedIds.includes(itemId)) return prev;
      const newState = {
        ...prev,
        learnedIds: [...prev.learnedIds, itemId],
      };
      saveVocabState(newState);
      return newState;
    });
    setCurrentItemIndex((prev) => prev + 1);
  }, []);

  // 次のアイテムへ
  const nextItem = useCallback(() => {
    setCurrentItemIndex((prev) => prev + 1);
  }, []);

  // ランクを変更
  const changeRank = useCallback((rankLevel: number) => {
    if (rankLevel > state.rankProgress.highestUnlockedRank) return;
    setState((prev) => {
      const newState = {
        ...prev,
        rankProgress: {
          ...prev.rankProgress,
          currentRank: rankLevel,
        },
      };
      saveVocabState(newState);
      return newState;
    });
    setCurrentItemIndex(0);
  }, [state.rankProgress.highestUnlockedRank]);

  // クイズに挑戦可能か
  const canTakeQuiz = useMemo(() => {
    return canAttemptQuiz(state.rankProgress.currentRank, state.learnedIds);
  }, [state.rankProgress.currentRank, state.learnedIds]);

  // リセット
  const reset = useCallback(() => {
    setState(initialVocabState);
    saveVocabState(initialVocabState);
    setCurrentItemIndex(0);
  }, []);

  // 状態を再読み込み（クイズ完了後などに使用）
  const reloadState = useCallback(() => {
    const loaded = loadVocabState();
    setState(loaded);
  }, []);

  return {
    // 状態
    state,
    isLoading,
    currentItem,
    currentRankInfo,
    currentRankVocabulary,
    progress,
    canTakeQuiz,

    // 全データ
    allRanks: RANKS,
    
    // アクション
    markAsLearned,
    nextItem,
    changeRank,
    reset,
    reloadState,
    setState,
  };
}

/**
 * クイズフック
 */
export function useQuiz(rankLevel: number, onComplete?: (result: QuizResult) => void) {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // クイズを開始
  const startQuiz = useCallback(() => {
    const newSession = generateQuizSession(rankLevel);
    setSession(newSession);
    setResult(null);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [rankLevel]);

  // 現在の問題
  const currentQuestion = useMemo(() => {
    if (!session) return null;
    return getCurrentQuestion(session);
  }, [session]);

  // 進捗
  const quizProgress = useMemo(() => {
    if (!session) return { current: 0, total: 0 };
    return {
      current: session.answers.length + 1,
      total: session.questions.length,
    };
  }, [session]);

  // 回答を送信
  const submitAnswer = useCallback((answer: string) => {
    if (!session || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);

    // 1.5秒後に次の問題へ
    setTimeout(() => {
      const newSession = recordAnswer(session, answer);
      setSession(newSession);
      setSelectedAnswer(null);
      setShowResult(false);

      // クイズ完了チェック
      if (isQuizComplete(newSession)) {
        const vocabState = loadVocabState();
        const quizResult = calculateQuizResult(newSession, vocabState.rankProgress);
        setResult(quizResult);
        
        // ランク進捗を更新
        const newRankProgress = updateRankProgress(vocabState.rankProgress, quizResult);
        const newVocabState = {
          ...vocabState,
          rankProgress: newRankProgress,
        };
        saveVocabState(newVocabState);
        
        onComplete?.(quizResult);
      }
    }, 1500);
  }, [session, currentQuestion, onComplete]);

  // クイズをリセット
  const resetQuiz = useCallback(() => {
    setSession(null);
    setResult(null);
    setSelectedAnswer(null);
    setShowResult(false);
  }, []);

  return {
    // 状態
    session,
    currentQuestion,
    result,
    selectedAnswer,
    showResult,
    quizProgress,
    isComplete: result !== null,

    // アクション
    startQuiz,
    submitAnswer,
    resetQuiz,
  };
}

