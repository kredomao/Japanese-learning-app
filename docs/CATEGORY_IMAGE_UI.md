# 意味カテゴリ画像のUI実装方法

## 概要

日本語学習アプリでは、各ことわざに個別画像は用意せず、**意味カテゴリごとに1つの共通画像**を使用します。
画像は「雰囲気」ではなく、**意味理解の補助**に限定します。

---

## UI実装方法

### 1. コンポーネントの使用

```tsx
import { CategoryImageCard } from './components/CategoryImageCard';
import { Phrase } from './types';

function PhraseCard({ phrase }: { phrase: Phrase }) {
  return (
    <div className="phrase-card">
      <h2>{phrase.phrase}</h2>
      <p>{phrase.meaning}</p>
      
      {/* 意味カテゴリ共通画像を表示 */}
      <CategoryImageCard phrase={phrase} />
    </div>
  );
}
```

### 2. データ構造

ことわざデータには `meaningCategory` フィールドが必要です:

```typescript
const phrase: Phrase = {
  id: 1,
  phrase: '七転び八起き',
  meaning: '何度失敗しても、あきらめずに立ち上がること',
  meaningCategory: 'persistence', // 意味カテゴリ
  // ...
};
```

### 3. カテゴリマッピング

ことわざIDから意味カテゴリを自動的に取得する関数を使用:

```typescript
import { getPhraseCategory } from './lib/category-image';

const category = getPhraseCategory(phraseId);
// 結果: 'persistence', 'failure-learning', など
```

### 4. 画像URLの取得

```typescript
import { getCategoryImageUrl } from './lib/category-image';

const imageUrl = getCategoryImageUrl(phrase);
if (imageUrl) {
  // 画像を表示
}
```

---

## 実装例

### 完全な実装例

```tsx
import { CategoryImageCard } from './components/CategoryImageCard';
import { Phrase } from './types';
import { getPhraseCategory } from './lib/category-image';

interface PhraseLearningCardProps {
  phrase: Phrase;
}

export function PhraseLearningCard({ phrase }: PhraseLearningCardProps) {
  // 意味カテゴリを取得（必要に応じて）
  const category = getPhraseCategory(phrase.id);

  return (
    <div className="phrase-learning-card">
      {/* ことわざ情報 */}
      <div className="phrase-learning-card__header">
        <h2 className="phrase-learning-card__title">{phrase.phrase}</h2>
        <p className="phrase-learning-card__reading">{phrase.reading}</p>
      </div>

      {/* 意味カテゴリ共通画像 */}
      <CategoryImageCard phrase={phrase} />

      {/* 意味と例文 */}
      <div className="phrase-learning-card__content">
        <p className="phrase-learning-card__meaning">{phrase.meaning}</p>
        <p className="phrase-learning-card__example">{phrase.example}</p>
      </div>
    </div>
  );
}
```

### CSS例

```css
.phrase-learning-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.phrase-learning-card__header {
  margin-bottom: 1.5rem;
}

.phrase-learning-card__title {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.phrase-learning-card__reading {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.phrase-learning-card__content {
  margin-top: 1.5rem;
}

.phrase-learning-card__meaning {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.phrase-learning-card__example {
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
  margin: 0;
}
```

---

## カテゴリ画像の設定

### 画像URLの設定

`src/data/meaning-categories.ts` で各カテゴリの画像URLを設定:

```typescript
export const MEANING_CATEGORIES: Record<MeaningCategory, MeaningCategoryDefinition> = {
  persistence: {
    // ...
    imageUrl: '/images/categories/persistence.jpg', // 画像URLを設定
    imageAlt: '努力・継続系の学習補助画像: 同じ動作を繰り返し続けている様子',
  },
  // ...
};
```

### 画像の選定

各カテゴリの画像は、`docs/MEANING_CATEGORIES.md` に記載されたコンセプトと検索キーワードに基づいて選定してください。

---

## アクセシビリティ

### alt属性

画像には必ず適切な `alt` 属性が設定されます:

```typescript
const alt = getCategoryImageAlt(phrase);
// 結果: "努力・継続系の学習補助画像: 同じ動作を繰り返し続けている様子"
```

### 説明文

画像の下に必ず説明文が表示されます:

```typescript
const caption = getCategoryImageCaption(phrase);
// 結果: "この画像は同じ動作を繰り返し続けている様子を表しています。何度失敗しても、あきらめずに立ち上がることという意味を視覚的に理解するためのものです。"
```

---

## まとめ

意味カテゴリ共通画像のUI実装は以下の通りです:

1. **コンポーネント使用**: `CategoryImageCard` コンポーネントを使用
2. **データ構造**: ことわざデータに `meaningCategory` フィールドを追加
3. **画像URL設定**: `src/data/meaning-categories.ts` で画像URLを設定
4. **アクセシビリティ**: alt属性と説明文が自動的に設定される

画像は必ず「意味理解の補助」に限定し、雰囲気づくりではなく、学習者がことわざの意味を視覚的に理解できるようにします。

