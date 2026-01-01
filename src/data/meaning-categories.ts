/**
 * 意味カテゴリ定義データ
 * 各カテゴリの定義と共通画像情報
 */

import { MeaningCategory, MeaningCategoryDefinition } from '../types';

/**
 * 意味カテゴリの定義一覧
 */
export const MEANING_CATEGORIES: Record<MeaningCategory, MeaningCategoryDefinition> = {
  // 努力・継続系
  persistence: {
    id: 'persistence',
    name: '努力・継続系',
    nameEn: 'Persistence',
    description: '物事を続けること、努力すること、忍耐強く取り組むことに関する意味',
    imageConcept: '同じ動作を繰り返し続けている様子を現実に近い状況で描写する。人が同じ動作を繰り返している様子（例: 毎日の運動、勉強など）。時間の経過を示す要素（可能であれば）。背景は白または単色。装飾的要素は一切なし。',
    searchKeywords: [
      'person repeating same action',
      'daily practice routine',
      'consistent effort realistic',
      'repetitive action documentary',
    ],
    imageUrl: '', // TODO: 実際の画像URLを追加
    imageAlt: '努力・継続系の学習補助画像: 同じ動作を繰り返し続けている様子',
  },

  // 失敗・学習系
  'failure-learning': {
    id: 'failure-learning',
    name: '失敗・学習系',
    nameEn: 'Failure & Learning',
    description: '失敗すること、失敗から学ぶこと、誰でも失敗することがあるという意味',
    imageConcept: '得意なことでも失敗することがある、または失敗から学ぶという意味を現実に近い状況で描写する。得意なことでも失敗する様子（例: 猿が木から落ちる、人が転倒するなど）。失敗した後、再び立ち上がろうとしている様子。背景は白または単色。装飾的要素は一切なし。',
    searchKeywords: [
      'expert making mistake realistic',
      'failure and recovery',
      'learning from mistake',
      'skilled person error',
    ],
    imageUrl: '', // TODO: 実際の画像URLを追加
    imageAlt: '失敗・学習系の学習補助画像: 得意なことでも失敗することがある様子',
  },

  // 知恵・判断系
  'wisdom-decision': {
    id: 'wisdom-decision',
    name: '知恵・判断系',
    nameEn: 'Wisdom & Decision',
    description: '知恵を働かせること、適切な判断をすること、効率的な方法を選ぶことに関する意味',
    imageConcept: '知恵や判断を現実に近い状況で描写する。複数の選択肢から選ぶ様子（例: 2つの道、複数の方法など）。または、複数の人が相談している様子（協力して知恵を出す）。背景は白または単色。装飾的要素は一切なし。',
    searchKeywords: [
      'choosing between options realistic',
      'people discussing together',
      'decision making simple',
      'multiple paths choice',
    ],
    imageUrl: '', // TODO: 実際の画像URLを追加
    imageAlt: '知恵・判断系の学習補助画像: 知恵を働かせて判断する様子',
  },

  // 行動・挑戦系
  'action-challenge': {
    id: 'action-challenge',
    name: '行動・挑戦系',
    nameEn: 'Action & Challenge',
    description: '実際に行動すること、挑戦すること、経験を積むことに関する意味',
    imageConcept: '実際に行動する、挑戦するという意味を現実に近い状況で描写する。人が実際に何かをしている様子（例: 作業をしている、挑戦している）。理論ではなく実践を表す。背景は白または単色。装飾的要素は一切なし。',
    searchKeywords: [
      'person taking action realistic',
      'hands on experience',
      'practical action simple',
      'doing rather than thinking',
    ],
    imageUrl: '', // TODO: 実際の画像URLを追加
    imageAlt: '行動・挑戦系の学習補助画像: 実際に行動する、挑戦する様子',
  },

  // 生活・習慣系
  'daily-life': {
    id: 'daily-life',
    name: '生活・習慣系',
    nameEn: 'Daily Life',
    description: '日常生活や習慣に関する意味',
    imageConcept: '日常生活や習慣を現実に近い状況で描写する。日常的な行動や習慣（例: 早起き、規則正しい生活など）。生活の一部として自然に行われている様子。背景は白または単色。装飾的要素は一切なし。',
    searchKeywords: [
      'daily routine realistic',
      'morning routine simple',
      'daily habit documentary',
      'everyday life activity',
    ],
    imageUrl: '', // TODO: 実際の画像URLを追加
    imageAlt: '生活・習慣系の学習補助画像: 日常生活や習慣',
  },

  // 関係・成長系
  'relationship-growth': {
    id: 'relationship-growth',
    name: '関係・成長系',
    nameEn: 'Relationship & Growth',
    description: '人間関係や成長に関する意味',
    imageConcept: '困難を経験した後、より強固になるという意味を現実に近い状況で描写する。困難や問題を経験した後、より強固な状態になる様子。関係や状態の変化を表す。背景は白または単色。装飾的要素は一切なし。',
    searchKeywords: [
      'relationship strengthening realistic',
      'growth after difficulty',
      'stronger after challenge',
      'bond after hardship',
    ],
    imageUrl: '', // TODO: 実際の画像URLを追加
    imageAlt: '関係・成長系の学習補助画像: 困難を経験した後、より強固になる様子',
  },

  // 品格・態度系
  'character-attitude': {
    id: 'character-attitude',
    name: '品格・態度系',
    nameEn: 'Character & Attitude',
    description: '品格や態度に関する意味',
    imageConcept: '能力があるが、それをひけらかさないという意味を現実に近い状況で描写する。能力があるが控えめな様子。謙虚さや品格を表す。背景は白または単色。装飾的要素は一切なし。',
    searchKeywords: [
      'humble skilled person',
      'modest expert realistic',
      'skilled but humble',
      'competent but reserved',
    ],
    imageUrl: '', // TODO: 実際の画像URLを追加
    imageAlt: '品格・態度系の学習補助画像: 能力があるが控えめな様子',
  },

  // 人生・出会い系
  'life-encounter': {
    id: 'life-encounter',
    name: '人生・出会い系',
    nameEn: 'Life & Encounter',
    description: '人生や出会いに関する意味',
    imageConcept: '人生や出会いを現実に近い状況で描写する。人生の重要な瞬間や出会い。幸福や大切な機会を表す。背景は白または単色。装飾的要素は一切なし。',
    searchKeywords: [
      'meaningful encounter realistic',
      'life moment simple',
      'important meeting documentary',
      'special moment realistic',
    ],
    imageUrl: '', // TODO: 実際の画像URLを追加
    imageAlt: '人生・出会い系の学習補助画像: 人生の重要な瞬間や出会い',
  },
};

/**
 * 意味カテゴリIDから定義を取得
 */
export function getMeaningCategory(categoryId: MeaningCategory): MeaningCategoryDefinition {
  return MEANING_CATEGORIES[categoryId];
}

/**
 * 全ての意味カテゴリを取得
 */
export function getAllMeaningCategories(): MeaningCategoryDefinition[] {
  return Object.values(MEANING_CATEGORIES);
}

