/**
 * ボキャブラリーデータ & ランク定義
 */

import { VocabularyItem, Rank, VocabularyCategory } from '../types/vocabulary';

// ============================================
// 🏆 ランク定義
// ============================================

export const RANKS: Rank[] = [
  {
    level: 1,
    name: '初心者',
    category: 'furniture',
    description: '家具の名前を覚えよう！',
    requiredScore: 70,
    icon: '🪑',
    color: '#4ade80',
  },
  {
    level: 2,
    name: '見習い',
    category: 'food',
    description: '食べ物の名前を覚えよう！',
    requiredScore: 70,
    icon: '🍎',
    color: '#fb923c',
  },
  {
    level: 3,
    name: '学習者',
    category: 'animals',
    description: '動物の名前を覚えよう！',
    requiredScore: 75,
    icon: '🐕',
    color: '#f472b6',
  },
  {
    level: 4,
    name: '探求者',
    category: 'clothes',
    description: '服の名前を覚えよう！',
    requiredScore: 75,
    icon: '👕',
    color: '#60a5fa',
  },
  {
    level: 5,
    name: '挑戦者',
    category: 'body',
    description: '体の部位を覚えよう！',
    requiredScore: 80,
    icon: '🖐️',
    color: '#c084fc',
  },
  {
    level: 6,
    name: '熟練者',
    category: 'kitchen',
    description: 'キッチン用品を覚えよう！',
    requiredScore: 80,
    icon: '🍳',
    color: '#facc15',
  },
  {
    level: 7,
    name: '達人',
    category: 'nature',
    description: '自然の言葉を覚えよう！',
    requiredScore: 80,
    icon: '🌳',
    color: '#34d399',
  },
  {
    level: 8,
    name: 'マスター',
    category: 'transport',
    description: '乗り物の名前を覚えよう！',
    requiredScore: 85,
    icon: '🚗',
    color: '#f87171',
  },
  {
    level: 9,
    name: 'エキスパート',
    category: 'buildings',
    description: '建物の名前を覚えよう！',
    requiredScore: 85,
    icon: '🏠',
    color: '#a78bfa',
  },
  {
    level: 10,
    name: '賢者',
    category: 'proverbs',
    description: 'ことわざを学ぼう！🎉',
    requiredScore: 80,
    icon: '📜',
    color: '#fbbf24',
  },
];

// ============================================
// 📚 ボキャブラリーデータ
// ============================================

export const VOCABULARY: VocabularyItem[] = [
  // ========== ランク1: 家具 ==========
  // 各単語に正しい絵文字を設定
  { id: 1, word: '椅子', reading: 'いす', meaning: 'Chair', image: '🪑', category: 'furniture', rank: 1 },
  { id: 2, word: '机', reading: 'つくえ', meaning: 'Desk', image: '📝', category: 'furniture', rank: 1 }, // 机専用絵文字がないのでノートを使用
  { id: 3, word: 'ベッド', reading: 'べっど', meaning: 'Bed', image: '🛏️', category: 'furniture', rank: 1 },
  { id: 4, word: 'ソファ', reading: 'そふぁ', meaning: 'Sofa', image: '🛋️', category: 'furniture', rank: 1 },
  { id: 5, word: '棚', reading: 'たな', meaning: 'Shelf', image: '🗄️', category: 'furniture', rank: 1 },
  { id: 6, word: '鏡', reading: 'かがみ', meaning: 'Mirror', image: '🪞', category: 'furniture', rank: 1 },
  { id: 7, word: 'ドア', reading: 'どあ', meaning: 'Door', image: '🚪', category: 'furniture', rank: 1 },
  { id: 8, word: '窓', reading: 'まど', meaning: 'Window', image: '🪟', category: 'furniture', rank: 1 },
  { id: 9, word: 'テーブル', reading: 'てーぶる', meaning: 'Table', image: '🍽️', category: 'furniture', rank: 1 }, // テーブル専用絵文字がないので食器を使用
  { id: 10, word: 'クローゼット', reading: 'くろーぜっと', meaning: 'Closet', image: '🗄️', category: 'furniture', rank: 1 }, // クローゼット専用絵文字がないのでキャビネットを使用

  // ========== ランク2: 食べ物 ==========
  { id: 11, word: 'りんご', reading: 'りんご', meaning: 'Apple', image: '🍎', category: 'food', rank: 2 },
  { id: 12, word: 'バナナ', reading: 'ばなな', meaning: 'Banana', image: '🍌', category: 'food', rank: 2 },
  { id: 13, word: 'パン', reading: 'ぱん', meaning: 'Bread', image: '🍞', category: 'food', rank: 2 },
  { id: 14, word: 'ご飯', reading: 'ごはん', meaning: 'Rice', image: '🍚', category: 'food', rank: 2 },
  { id: 15, word: '卵', reading: 'たまご', meaning: 'Egg', image: '🥚', category: 'food', rank: 2 },
  { id: 16, word: '肉', reading: 'にく', meaning: 'Meat', image: '🥩', category: 'food', rank: 2 },
  { id: 17, word: '魚', reading: 'さかな', meaning: 'Fish', image: '🐟', category: 'food', rank: 2 },
  { id: 18, word: '野菜', reading: 'やさい', meaning: 'Vegetables', image: '🥬', category: 'food', rank: 2 },
  { id: 19, word: '水', reading: 'みず', meaning: 'Water', image: '💧', category: 'food', rank: 2 },
  { id: 20, word: 'お茶', reading: 'おちゃ', meaning: 'Tea', image: '🍵', category: 'food', rank: 2 },

  // ========== ランク3: 動物 ==========
  { id: 21, word: '犬', reading: 'いぬ', meaning: 'Dog', image: '🐕', category: 'animals', rank: 3 },
  { id: 22, word: '猫', reading: 'ねこ', meaning: 'Cat', image: '🐈', category: 'animals', rank: 3 },
  { id: 23, word: '鳥', reading: 'とり', meaning: 'Bird', image: '🐦', category: 'animals', rank: 3 },
  { id: 24, word: '魚', reading: 'さかな', meaning: 'Fish', image: '🐠', category: 'animals', rank: 3 },
  { id: 25, word: '馬', reading: 'うま', meaning: 'Horse', image: '🐴', category: 'animals', rank: 3 },
  { id: 26, word: '牛', reading: 'うし', meaning: 'Cow', image: '🐄', category: 'animals', rank: 3 },
  { id: 27, word: '豚', reading: 'ぶた', meaning: 'Pig', image: '🐷', category: 'animals', rank: 3 },
  { id: 28, word: '羊', reading: 'ひつじ', meaning: 'Sheep', image: '🐑', category: 'animals', rank: 3 },
  { id: 29, word: '兎', reading: 'うさぎ', meaning: 'Rabbit', image: '🐰', category: 'animals', rank: 3 },
  { id: 30, word: '象', reading: 'ぞう', meaning: 'Elephant', image: '🐘', category: 'animals', rank: 3 },

  // ========== ランク4: 服 ==========
  { id: 31, word: 'シャツ', reading: 'しゃつ', meaning: 'Shirt', image: '👕', category: 'clothes', rank: 4 },
  { id: 32, word: 'ズボン', reading: 'ずぼん', meaning: 'Pants', image: '👖', category: 'clothes', rank: 4 },
  { id: 33, word: 'スカート', reading: 'すかーと', meaning: 'Skirt', image: '👗', category: 'clothes', rank: 4 },
  { id: 34, word: '靴', reading: 'くつ', meaning: 'Shoes', image: '👟', category: 'clothes', rank: 4 },
  { id: 35, word: '帽子', reading: 'ぼうし', meaning: 'Hat', image: '🧢', category: 'clothes', rank: 4 },
  { id: 36, word: 'コート', reading: 'こーと', meaning: 'Coat', image: '🧥', category: 'clothes', rank: 4 },
  { id: 37, word: '靴下', reading: 'くつした', meaning: 'Socks', image: '🧦', category: 'clothes', rank: 4 },
  { id: 38, word: 'ネクタイ', reading: 'ねくたい', meaning: 'Tie', image: '👔', category: 'clothes', rank: 4 },
  { id: 39, word: '眼鏡', reading: 'めがね', meaning: 'Glasses', image: '👓', category: 'clothes', rank: 4 },
  { id: 40, word: '手袋', reading: 'てぶくろ', meaning: 'Gloves', image: '🧤', category: 'clothes', rank: 4 },

  // ========== ランク5: 体の部位 ==========
  { id: 41, word: '頭', reading: 'あたま', meaning: 'Head', image: '👤', category: 'body', rank: 5 },
  { id: 42, word: '目', reading: 'め', meaning: 'Eye', image: '👁️', category: 'body', rank: 5 },
  { id: 43, word: '耳', reading: 'みみ', meaning: 'Ear', image: '👂', category: 'body', rank: 5 },
  { id: 44, word: '鼻', reading: 'はな', meaning: 'Nose', image: '👃', category: 'body', rank: 5 },
  { id: 45, word: '口', reading: 'くち', meaning: 'Mouth', image: '👄', category: 'body', rank: 5 },
  { id: 46, word: '手', reading: 'て', meaning: 'Hand', image: '✋', category: 'body', rank: 5 },
  { id: 47, word: '足', reading: 'あし', meaning: 'Foot/Leg', image: '🦶', category: 'body', rank: 5 },
  { id: 48, word: '指', reading: 'ゆび', meaning: 'Finger', image: '👆', category: 'body', rank: 5 },
  { id: 49, word: '心臓', reading: 'しんぞう', meaning: 'Heart', image: '❤️', category: 'body', rank: 5 },
  { id: 50, word: '髪', reading: 'かみ', meaning: 'Hair', image: '💇', category: 'body', rank: 5 },

  // ========== ランク6: キッチン用品 ==========
  { id: 51, word: '皿', reading: 'さら', meaning: 'Plate', image: '🍽️', category: 'kitchen', rank: 6 },
  { id: 52, word: 'コップ', reading: 'こっぷ', meaning: 'Cup', image: '🥛', category: 'kitchen', rank: 6 },
  { id: 53, word: '箸', reading: 'はし', meaning: 'Chopsticks', image: '🥢', category: 'kitchen', rank: 6 },
  { id: 54, word: 'スプーン', reading: 'すぷーん', meaning: 'Spoon', image: '🥄', category: 'kitchen', rank: 6 },
  { id: 55, word: 'フォーク', reading: 'ふぉーく', meaning: 'Fork', image: '/images/vocabulary/fork.png', category: 'kitchen', rank: 6 },
  { id: 56, word: '鍋', reading: 'なべ', meaning: 'Pot', image: '🍲', category: 'kitchen', rank: 6 },
  { id: 57, word: 'フライパン', reading: 'ふらいぱん', meaning: 'Frying pan', image: '🍳', category: 'kitchen', rank: 6 },
  { id: 58, word: '冷蔵庫', reading: 'れいぞうこ', meaning: 'Refrigerator', image: '🧊', category: 'kitchen', rank: 6 },
  { id: 59, word: '電子レンジ', reading: 'でんしれんじ', meaning: 'Microwave', image: '/images/vocabulary/microwave.png', category: 'kitchen', rank: 6 },
  { id: 60, word: '包丁', reading: 'ほうちょう', meaning: 'Kitchen knife', image: '🔪', category: 'kitchen', rank: 6 },

  // ========== ランク7: 自然 ==========
  { id: 61, word: '木', reading: 'き', meaning: 'Tree', image: '🌳', category: 'nature', rank: 7 },
  { id: 62, word: '花', reading: 'はな', meaning: 'Flower', image: '🌸', category: 'nature', rank: 7 },
  { id: 63, word: '山', reading: 'やま', meaning: 'Mountain', image: '⛰️', category: 'nature', rank: 7 },
  { id: 64, word: '川', reading: 'かわ', meaning: 'River', image: '🏞️', category: 'nature', rank: 7 },
  { id: 65, word: '海', reading: 'うみ', meaning: 'Sea', image: '🌊', category: 'nature', rank: 7 },
  { id: 66, word: '空', reading: 'そら', meaning: 'Sky', image: '🌤️', category: 'nature', rank: 7 },
  { id: 67, word: '太陽', reading: 'たいよう', meaning: 'Sun', image: '☀️', category: 'nature', rank: 7 },
  { id: 68, word: '月', reading: 'つき', meaning: 'Moon', image: '🌙', category: 'nature', rank: 7 },
  { id: 69, word: '星', reading: 'ほし', meaning: 'Star', image: '⭐', category: 'nature', rank: 7 },
  { id: 70, word: '雨', reading: 'あめ', meaning: 'Rain', image: '🌧️', category: 'nature', rank: 7 },

  // ========== ランク8: 乗り物 ==========
  { id: 71, word: '車', reading: 'くるま', meaning: 'Car', image: '🚗', category: 'transport', rank: 8 },
  { id: 72, word: '電車', reading: 'でんしゃ', meaning: 'Train', image: '🚃', category: 'transport', rank: 8 },
  { id: 73, word: 'バス', reading: 'ばす', meaning: 'Bus', image: '🚌', category: 'transport', rank: 8 },
  { id: 74, word: '自転車', reading: 'じてんしゃ', meaning: 'Bicycle', image: '🚲', category: 'transport', rank: 8 },
  { id: 75, word: '飛行機', reading: 'ひこうき', meaning: 'Airplane', image: '✈️', category: 'transport', rank: 8 },
  { id: 76, word: '船', reading: 'ふね', meaning: 'Ship', image: '🚢', category: 'transport', rank: 8 },
  { id: 77, word: 'タクシー', reading: 'たくしー', meaning: 'Taxi', image: '🚕', category: 'transport', rank: 8 },
  { id: 78, word: 'バイク', reading: 'ばいく', meaning: 'Motorcycle', image: '🏍️', category: 'transport', rank: 8 },
  { id: 79, word: '地下鉄', reading: 'ちかてつ', meaning: 'Subway', image: '🚇', category: 'transport', rank: 8 },
  { id: 80, word: 'ヘリコプター', reading: 'へりこぷたー', meaning: 'Helicopter', image: '🚁', category: 'transport', rank: 8 },

  // ========== ランク9: 建物 ==========
  { id: 81, word: '家', reading: 'いえ', meaning: 'House', image: '🏠', category: 'buildings', rank: 9 },
  { id: 82, word: '学校', reading: 'がっこう', meaning: 'School', image: '🏫', category: 'buildings', rank: 9 },
  { id: 83, word: '病院', reading: 'びょういん', meaning: 'Hospital', image: '🏥', category: 'buildings', rank: 9 },
  { id: 84, word: '駅', reading: 'えき', meaning: 'Station', image: '🚉', category: 'buildings', rank: 9 },
  { id: 85, word: '店', reading: 'みせ', meaning: 'Shop', image: '🏪', category: 'buildings', rank: 9 },
  { id: 86, word: 'ホテル', reading: 'ほてる', meaning: 'Hotel', image: '🏨', category: 'buildings', rank: 9 },
  { id: 87, word: '銀行', reading: 'ぎんこう', meaning: 'Bank', image: '🏦', category: 'buildings', rank: 9 },
  { id: 88, word: '図書館', reading: 'としょかん', meaning: 'Library', image: '📚', category: 'buildings', rank: 9 },
  { id: 89, word: '公園', reading: 'こうえん', meaning: 'Park', image: '🏞️', category: 'buildings', rank: 9 },
  { id: 90, word: '教会', reading: 'きょうかい', meaning: 'Church', image: '⛪', category: 'buildings', rank: 9 },
];

// ============================================
// 🔧 ヘルパー関数
// ============================================

/**
 * ランクに応じたボキャブラリーを取得
 */
export function getVocabularyByRank(rank: number): VocabularyItem[] {
  return VOCABULARY.filter((v) => v.rank === rank);
}

/**
 * カテゴリに応じたボキャブラリーを取得
 */
export function getVocabularyByCategory(category: VocabularyCategory): VocabularyItem[] {
  return VOCABULARY.filter((v) => v.category === category);
}

/**
 * ランク情報を取得
 */
export function getRankInfo(level: number): Rank | undefined {
  return RANKS.find((r) => r.level === level);
}

/**
 * 解放済みの全ボキャブラリーを取得
 */
export function getUnlockedVocabulary(highestRank: number): VocabularyItem[] {
  return VOCABULARY.filter((v) => v.rank <= highestRank);
}

