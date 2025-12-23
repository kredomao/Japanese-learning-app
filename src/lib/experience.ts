/**
 * 経験値・レベル管理ロジック
 * UIに依存しない純粋な関数群
 */

import {
  UserState,
  ExperienceResult,
  EXP_PER_LEARNING,
  EXP_MULTIPLIER,
} from '../types';

/**
 * 次のレベルに必要な総経験値を計算
 * @param level 現在のレベル
 * @returns 次レベルに必要な経験値
 */
export function getRequiredExpForLevel(level: number): number {
  return level * EXP_MULTIPLIER;
}

/**
 * 現在のレベルでの経験値進捗を取得
 * @param state ユーザー状態
 * @returns { current: 現在の経験値, required: 必要経験値, percentage: 進捗率 }
 */
export function getExpProgress(state: UserState): {
  current: number;
  required: number;
  percentage: number;
} {
  const required = getRequiredExpForLevel(state.level);
  const percentage = Math.min((state.experience / required) * 100, 100);

  return {
    current: state.experience,
    required,
    percentage: Math.round(percentage),
  };
}

/**
 * レベルアップ可能かチェック
 * @param state ユーザー状態
 * @returns レベルアップ可能かどうか
 */
export function canLevelUp(state: UserState): boolean {
  const required = getRequiredExpForLevel(state.level);
  return state.experience >= required;
}

/**
 * 経験値を獲得し、レベルアップ処理を行う
 * @param currentState 現在のユーザー状態
 * @param expGain 獲得経験値（デフォルト: EXP_PER_LEARNING）
 * @returns 経験値獲得結果
 */
export function gainExperience(
  currentState: UserState,
  expGain: number = EXP_PER_LEARNING
): ExperienceResult {
  let newExperience = currentState.experience + expGain;
  let newLevel = currentState.level;
  let leveledUp = false;

  // レベルアップ判定（複数回レベルアップする可能性も考慮）
  while (newExperience >= getRequiredExpForLevel(newLevel)) {
    newExperience -= getRequiredExpForLevel(newLevel);
    newLevel++;
    leveledUp = true;
  }

  return {
    newExperience,
    newLevel,
    leveledUp,
    experienceGained: expGain,
    bonusExp: 0,           // 呼び出し元で設定
    streakMultiplier: 1,   // 呼び出し元で設定
  };
}

/**
 * 経験値結果をユーザー状態に適用
 * @param state 現在のユーザー状態
 * @param result 経験値獲得結果
 * @returns 更新されたユーザー状態
 */
export function applyExperienceResult(
  state: UserState,
  result: ExperienceResult
): UserState {
  return {
    ...state,
    experience: result.newExperience,
    level: result.newLevel,
  };
}

/**
 * レベルに応じた称号を取得
 * @param level レベル
 * @returns 称号文字列
 */
export function getLevelTitle(level: number): string {
  if (level >= 50) return '日本語の達人';
  if (level >= 40) return '言葉の師範';
  if (level >= 30) return 'ことわざ博士';
  if (level >= 20) return '言い回しの使い手';
  if (level >= 10) return '学習の探求者';
  if (level >= 5) return '入門者';
  return '初心者';
}

