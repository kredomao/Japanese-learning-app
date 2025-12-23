/**
 * LocalStorage管理
 * ユーザー状態の永続化を担当
 */

import { UserState } from '../types';

const STORAGE_KEY = 'japanese-learning-user-state';

/**
 * ユーザー状態の初期値（拡張版）
 */
export const initialUserState: UserState = {
  // 基本ステータス
  level: 1,
  experience: 0,
  totalExp: 0,
  learnedPhraseIds: [],
  
  // 連続学習
  streak: 0,
  bestStreak: 0,
  lastLearnedAt: null,
  
  // ゲーミフィケーション
  unlockedAchievements: [],
  currentTitle: '初心者',
  unlockedTitles: ['初心者'],
  
  // デイリーミッション
  dailyMissions: null,
  
  // 統計
  stats: {
    totalLearned: 0,
    todayLearned: 0,
    lastActiveDate: null,
    tagProgress: {},
  },
};

/**
 * LocalStorageが使用可能かチェック
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * ユーザー状態をLocalStorageから読み込み
 * @returns ユーザー状態（存在しない場合は初期値）
 */
export function loadUserState(): UserState {
  if (!isStorageAvailable()) {
    return initialUserState;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return initialUserState;
    }

    const parsed = JSON.parse(stored) as Partial<UserState>;

    // 既存データと初期値をマージ（将来のフィールド追加に対応）
    return {
      ...initialUserState,
      ...parsed,
    };
  } catch (error) {
    console.error('Failed to load user state:', error);
    return initialUserState;
  }
}

/**
 * ユーザー状態をLocalStorageに保存
 * @param state 保存するユーザー状態
 * @returns 保存成功かどうか
 */
export function saveUserState(state: UserState): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Failed to save user state:', error);
    return false;
  }
}

/**
 * ユーザー状態をリセット
 * @returns リセット成功かどうか
 */
export function resetUserState(): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to reset user state:', error);
    return false;
  }
}

/**
 * 連続学習日数の更新判定
 * @param lastLearnedAt 最終学習日
 * @returns { shouldIncrement: 連続日数を増やすか, shouldReset: リセットするか }
 */
export function checkStreakUpdate(lastLearnedAt: string | null): {
  shouldIncrement: boolean;
  shouldReset: boolean;
} {
  if (!lastLearnedAt) {
    return { shouldIncrement: true, shouldReset: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastLearnedAt);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // 同じ日：連続日数は変わらない
    return { shouldIncrement: false, shouldReset: false };
  } else if (diffDays === 1) {
    // 翌日：連続日数を増やす
    return { shouldIncrement: true, shouldReset: false };
  } else {
    // 2日以上空いた：リセットして1から
    return { shouldIncrement: false, shouldReset: true };
  }
}

