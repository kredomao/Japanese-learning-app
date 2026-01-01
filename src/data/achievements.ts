/**
 * 実績定義データ
 * 🏆 ゲーミフィケーションの核心部分
 */

import { Achievement, LevelReward } from '../types';

// ============================================
// 🏅 実績一覧
// ============================================

export const ACHIEVEMENTS: Achievement[] = [
  // ======== 学習系 (learning) ========
  {
    id: 'first_step',
    name: '最初の一歩',
    description: '初めてのことわざを覚えた',
    icon: '🐣',
    category: 'learning',
    condition: { type: 'learned_count', value: 1 },
    reward: { exp: 10 },
    rarity: 'common',
  },
  {
    id: 'getting_started',
    name: '学習開始',
    description: '5つのことわざを覚えた',
    icon: '📖',
    category: 'learning',
    condition: { type: 'learned_count', value: 5 },
    reward: { exp: 25 },
    rarity: 'common',
  },
  {
    id: 'dedicated_learner',
    name: '熱心な学習者',
    description: '10個のことわざを覚えた',
    icon: '📚',
    category: 'learning',
    condition: { type: 'learned_count', value: 10 },
    reward: { exp: 50, title: '勉強家' },
    rarity: 'common',
  },
  {
    id: 'phrase_collector',
    name: 'ことわざコレクター',
    description: '25個のことわざを覚えた',
    icon: '🎯',
    category: 'learning',
    condition: { type: 'learned_count', value: 25 },
    reward: { exp: 100 },
    rarity: 'rare',
  },
  {
    id: 'wisdom_seeker',
    name: '知恵の探求者',
    description: '50個のことわざを覚えた',
    icon: '🔮',
    category: 'learning',
    condition: { type: 'learned_count', value: 50 },
    reward: { exp: 200, title: '知恵者' },
    rarity: 'rare',
  },
  {
    id: 'master_scholar',
    name: '博識の士',
    description: '100個のことわざを覚えた',
    icon: '🎓',
    category: 'learning',
    condition: { type: 'learned_count', value: 100 },
    reward: { exp: 500, title: '博識の士' },
    rarity: 'epic',
  },
  {
    id: 'living_dictionary',
    name: '生きた辞書',
    description: '200個のことわざを覚えた',
    icon: '📕',
    category: 'learning',
    condition: { type: 'learned_count', value: 200 },
    reward: { exp: 1000, title: '生きた辞書' },
    rarity: 'legendary',
  },

  // ======== 連続学習系 (streak) ========
  {
    id: 'three_day_streak',
    name: '三日坊主...じゃない！',
    description: '3日連続で学習した',
    icon: '🔥',
    category: 'streak',
    condition: { type: 'streak', value: 3 },
    reward: { exp: 30 },
    rarity: 'common',
  },
  {
    id: 'week_warrior',
    name: '一週間の戦士',
    description: '7日連続で学習した',
    icon: '⚔️',
    category: 'streak',
    condition: { type: 'streak', value: 7 },
    reward: { exp: 70, title: '継続の力' },
    rarity: 'rare',
  },
  {
    id: 'fortnight_fighter',
    name: '二週間チャンピオン',
    description: '14日連続で学習した',
    icon: '🏅',
    category: 'streak',
    condition: { type: 'streak', value: 14 },
    reward: { exp: 150 },
    rarity: 'rare',
  },
  {
    id: 'monthly_master',
    name: '月間マスター',
    description: '30日連続で学習した',
    icon: '🌙',
    category: 'streak',
    condition: { type: 'streak', value: 30 },
    reward: { exp: 300, title: '鉄の意志' },
    rarity: 'epic',
  },
  {
    id: 'hundred_days',
    name: '百日の修行',
    description: '100日連続で学習した',
    icon: '👑',
    category: 'streak',
    condition: { type: 'streak', value: 100 },
    reward: { exp: 1000, title: '不屈の精神' },
    rarity: 'legendary',
  },

  // ======== レベル系 (level) ========
  {
    id: 'level_5',
    name: '入門突破',
    description: 'レベル5に到達',
    icon: '⭐',
    category: 'level',
    condition: { type: 'level', value: 5 },
    reward: { exp: 50 },
    rarity: 'common',
  },
  {
    id: 'level_10',
    name: '二桁の壁を越えて',
    description: 'レベル10に到達',
    icon: '🌟',
    category: 'level',
    condition: { type: 'level', value: 10 },
    reward: { exp: 100, title: '探求者' },
    rarity: 'rare',
  },
  {
    id: 'level_25',
    name: '中級者の証',
    description: 'レベル25に到達',
    icon: '💫',
    category: 'level',
    condition: { type: 'level', value: 25 },
    reward: { exp: 250 },
    rarity: 'rare',
  },
  {
    id: 'level_50',
    name: '半世紀の知恵',
    description: 'レベル50に到達',
    icon: '🌠',
    category: 'level',
    condition: { type: 'level', value: 50 },
    reward: { exp: 500, title: '賢者' },
    rarity: 'epic',
  },
  {
    id: 'level_100',
    name: '百の頂',
    description: 'レベル100に到達',
    icon: '✨',
    category: 'level',
    condition: { type: 'level', value: 100 },
    reward: { exp: 1000, title: '伝説の語り部' },
    rarity: 'legendary',
  },

  // ======== コレクション系 (collection) ========
  {
    id: 'effort_master',
    name: '努力の達人',
    description: '「努力」タグのことわざを全て覚えた',
    icon: '💪',
    category: 'collection',
    condition: { type: 'tag_mastery', value: 5, tag: '努力' },
    reward: { exp: 100, title: '努力家' },
    rarity: 'rare',
  },
  {
    id: 'wisdom_keeper',
    name: '知恵袋',
    description: '「知恵」タグのことわざを全て覚えた',
    icon: '🧠',
    category: 'collection',
    condition: { type: 'tag_mastery', value: 5, tag: '知恵' },
    reward: { exp: 100, title: '知恵袋' },
    rarity: 'rare',
  },

  // ======== 特別系 (special) ========
  {
    id: 'exp_1000',
    name: '千の経験',
    description: '累計1000経験値を獲得',
    icon: '💎',
    category: 'special',
    condition: { type: 'total_exp', value: 1000 },
    reward: { exp: 100 },
    rarity: 'rare',
  },
  {
    id: 'exp_10000',
    name: '万の知恵',
    description: '累計10000経験値を獲得',
    icon: '💠',
    category: 'special',
    condition: { type: 'total_exp', value: 10000 },
    reward: { exp: 500, title: '経験の塔' },
    rarity: 'epic',
  },
];

// ============================================
// 🎁 レベルアップ報酬
// ============================================

export const LEVEL_REWARDS: LevelReward[] = [
  {
    level: 1,
    message: '日本語学習の旅が始まった！頑張ろう！🌸',
  },
  {
    level: 5,
    title: '入門者',
    bonusExp: 25,
    message: 'レベル5達成！入門者の称号を獲得！🎉',
  },
  {
    level: 10,
    title: '学習の探求者',
    bonusExp: 50,
    message: 'レベル10！探求者として認められた！✨',
  },
  {
    level: 15,
    bonusExp: 75,
    message: '着実に成長している！この調子！💪',
  },
  {
    level: 20,
    title: '言い回しの使い手',
    bonusExp: 100,
    message: 'レベル20！もう立派な学習者だ！🌟',
  },
  {
    level: 25,
    bonusExp: 125,
    unlocksFeature: 'advanced_phrases',
    message: '上級ことわざが解放された！📖',
  },
  {
    level: 30,
    title: 'ことわざ博士',
    bonusExp: 150,
    message: 'レベル30！博士の称号を獲得！🎓',
  },
  {
    level: 40,
    title: '言葉の師範',
    bonusExp: 200,
    message: 'レベル40！師範として他を導く存在に！⚔️',
  },
  {
    level: 50,
    title: '日本語の達人',
    bonusExp: 300,
    unlocksFeature: 'master_challenges',
    message: 'レベル50達成！達人の領域へ！👑',
  },
  {
    level: 75,
    bonusExp: 400,
    message: '75レベル...あなたは本物の学者だ！📚',
  },
  {
    level: 100,
    title: '伝説の語り部',
    bonusExp: 1000,
    message: '🏆 レベル100達成！伝説となった！🏆',
  },
];

// ============================================
// 📋 デイリーミッションテンプレート
// ============================================

import { DailyMission } from '../types';

export const DAILY_MISSION_TEMPLATES: Omit<DailyMission, 'id'>[] = [
  {
    type: 'learn_count',
    description: '今日3つのボキャブラリーを覚えよう',
    target: 3,
    reward: { exp: 30 },
  },
  {
    type: 'learn_count',
    description: '今日5つのボキャブラリーを覚えよう',
    target: 5,
    reward: { exp: 50 },
  },
  {
    type: 'learn_category',
    description: 'ボキャブラリーの「家具」を覚えよう',
    target: 1,
    category: 'furniture',
    reward: { exp: 20 },
  },
  {
    type: 'learn_category',
    description: 'ボキャブラリーの「食べ物」を覚えよう',
    target: 1,
    category: 'food',
    reward: { exp: 20 },
  },
  {
    type: 'learn_category',
    description: 'ボキャブラリーの「動物」を覚えよう',
    target: 1,
    category: 'animals',
    reward: { exp: 20 },
  },
  {
    type: 'learn_category',
    description: 'ボキャブラリーの「服」を覚えよう',
    target: 1,
    category: 'clothes',
    reward: { exp: 20 },
  },
  {
    type: 'learn_category',
    description: 'ボキャブラリーの「体の部位」を覚えよう',
    target: 1,
    category: 'body',
    reward: { exp: 20 },
  },
  {
    type: 'learn_category',
    description: 'ボキャブラリーの「キッチン用品」を覚えよう',
    target: 1,
    category: 'kitchen',
    reward: { exp: 20 },
  },
  {
    type: 'learn_category',
    description: 'ボキャブラリーの「自然」を覚えよう',
    target: 1,
    category: 'nature',
    reward: { exp: 20 },
  },
  {
    type: 'learn_category',
    description: 'ボキャブラリーの「乗り物」を覚えよう',
    target: 1,
    category: 'transport',
    reward: { exp: 20 },
  },
  {
    type: 'learn_category',
    description: 'ボキャブラリーの「建物」を覚えよう',
    target: 1,
    category: 'buildings',
    reward: { exp: 20 },
  },
];

/**
 * 実績IDで実績を取得
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * レベルの報酬を取得
 */
export function getLevelReward(level: number): LevelReward | undefined {
  return LEVEL_REWARDS.find((r) => r.level === level);
}

/**
 * レアリティに応じた色を取得（UI用）
 */
export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return '#9CA3AF'; // gray
    case 'rare':
      return '#3B82F6'; // blue
    case 'epic':
      return '#8B5CF6'; // purple
    case 'legendary':
      return '#F59E0B'; // gold
    default:
      return '#9CA3AF';
  }
}

/**
 * レアリティの日本語名
 */
export function getRarityName(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'ノーマル';
    case 'rare':
      return 'レア';
    case 'epic':
      return 'エピック';
    case 'legendary':
      return 'レジェンダリー';
    default:
      return 'ノーマル';
  }
}

