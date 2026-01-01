# クイックスタートガイド

## 概要

このガイドでは、日本語学習アプリのコアロジックを最小限のコードで使用する方法を説明します。

---

## 最小構成（MVP）

### 1. データの準備

```typescript
// phrases.json からデータを読み込む
import phrases from './data/phrases.json';
import { Phrase } from './types';
```

### 2. ユーザー状態の読み込み

```typescript
import { loadUserState } from './lib/storage';

const userState = loadUserState();
console.log(`現在のレベル: ${userState.level}`);
console.log(`学習済み: ${userState.learnedPhraseIds.length}個`);
```

### 3. 「覚えた」ボタンの実装

```typescript
import { markAsLearned } from './lib/learning';

function handleLearned(phraseId: number) {
  const result = markAsLearned(phraseId);
  
  if (result.success) {
    // レベルアップ通知
    if (result.leveledUp) {
      alert(`レベルアップ！ Lv.${result.newLevel}`);
    }
    
    // 経験値獲得通知
    console.log(`+${result.experienceGained} EXP 獲得`);
    
    // UI更新（Bolt.newで実装）
    updateUI(result.userState);
  }
}
```

### 4. 次のフレーズを取得

```typescript
import { getRandomUnlearnedPhraseId } from './lib/learning';

const allPhraseIds = phrases.map((p: Phrase) => p.id);
const nextPhraseId = getRandomUnlearnedPhraseId(userState, allPhraseIds);

if (nextPhraseId) {
  const nextPhrase = phrases.find((p: Phrase) => p.id === nextPhraseId);
  // フレーズを表示
} else {
  // 全て学習済み
  console.log('全てのフレーズを学習しました！');
}
```

---

## 完全な例（最小構成）

```typescript
import { 
  loadUserState, 
  markAsLearned, 
  getRandomUnlearnedPhraseId,
  getLearningProgress 
} from './lib';
import phrases from './data/phrases.json';
import { Phrase } from './types';

// 1. 初期化
let userState = loadUserState();
const allPhraseIds = (phrases as Phrase[]).map(p => p.id);

// 2. 次のフレーズを取得
function getNextPhrase() {
  const nextPhraseId = getRandomUnlearnedPhraseId(userState, allPhraseIds);
  if (!nextPhraseId) {
    return null;
  }
  return (phrases as Phrase[]).find(p => p.id === nextPhraseId);
}

// 3. 「覚えた」ボタンの処理
function handleLearned(phraseId: number) {
  const result = markAsLearned(phraseId);
  
  if (result.success) {
    // 状態を更新
    userState = result.userState;
    
    // 通知
    if (result.leveledUp) {
      console.log(`🎉 レベルアップ！ Lv.${result.newLevel}`);
    }
    console.log(`+${result.experienceGained} EXP`);
    
    // 進捗表示
    const progress = getLearningProgress(userState, phrases.length);
    console.log(`進捗: ${progress.learnedCount}/${progress.totalCount} (${progress.percentage}%)`);
    
    // 次のフレーズを取得
    return getNextPhrase();
  }
  
  return null;
}

// 4. 使用例
const currentPhrase = getNextPhrase();
if (currentPhrase) {
  console.log(`現在のフレーズ: ${currentPhrase.phrase}`);
  console.log(`意味: ${currentPhrase.meaning}`);
  
  // 「覚えた」ボタンを押したとき
  // const nextPhrase = handleLearned(currentPhrase.id);
}
```

---

## 必要な関数（MVP）

### 必須

| 関数 | 用途 | ファイル |
|------|------|---------|
| `loadUserState()` | ユーザー状態を読み込む | `lib/storage.ts` |
| `markAsLearned(phraseId)` | 「覚えた」ボタンの処理 | `lib/learning.ts` |
| `getRandomUnlearnedPhraseId()` | 次のフレーズを取得 | `lib/learning.ts` |

### オプション

| 関数 | 用途 | ファイル |
|------|------|---------|
| `getLearningProgress()` | 進捗を取得 | `lib/learning.ts` |
| `checkLevelUp()` | レベルアップ可能かチェック | `lib/experience.ts` |
| `getExpProgress()` | 経験値進捗を取得 | `lib/experience.ts` |

---

## データ構造（最小限）

### Phrase（ことわざデータ）

```typescript
{
  id: 1,
  phrase: "七転び八起き",
  reading: "ななころびやおき",
  meaning: "何度失敗しても、あきらめずに立ち上がること。",
  example: "彼は七転び八起きの精神で、何度も挑戦し続けた。",
  level: 1,
  tags: ["励まし", "人生", "初級"]
}
```

### UserState（ユーザー状態）

```typescript
{
  level: 1,
  experience: 0,
  totalExp: 0,
  learnedPhraseIds: [],
  streak: 0,
  bestStreak: 0,
  lastLearnedAt: null,
  // ... その他（ゲーミフィケーション要素）
}
```

---

## 次のステップ

1. **UI実装**: Bolt.newでUIを実装
2. **機能拡張**: ゲーミフィケーション機能を追加
3. **テスト**: ユニットテストを追加
4. **最適化**: パフォーマンス改善

詳細は以下を参照:
- [アーキテクチャ設計書](./ARCHITECTURE.md)
- [API仕様書](./API.md)

