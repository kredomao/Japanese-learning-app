# UI画像実装ガイドライン

## 概要

学習補助画像をUIに組み込む際の実装ガイドラインです。
画像だけで意味を完結させず、必ず説明文を表示して学習者の理解を助けます。

---

## 必須要件

### 1. 画像の下に必ず説明文を表示

**絶対に守るべきルール**:
- 画像の下に必ず短い説明文を表示する
- 画像だけで意味を完結させない
- 学習者が「なぜこの画像なのか」理解できる構成にする

### 2. 説明文フォーマット

**標準フォーマット**:
```
この画像は◯◯を表しています。◯◯という意味を視覚的に理解するためのものです。
```

**例**:
- 「この画像は猿が木から落ちる様子を表しています。どんなに得意な人でも失敗することがあるという意味を視覚的に理解するためのものです。」
- 「この画像は転倒して立ち上がる動作を表しています。何度失敗しても、あきらめずに立ち上がることという意味を視覚的に理解するためのものです。」

---

## 実装方法

### TypeScript/React での実装例

```tsx
import { Phrase } from './types';
import { generateImageCaption, generateImageAlt } from './lib/image-selection';

interface PhraseImageProps {
  phrase: Phrase;
}

export function PhraseImage({ phrase }: PhraseImageProps) {
  // 画像が存在しない場合は表示しない
  if (!phrase.image) {
    return null;
  }

  const caption = generateImageCaption(phrase);
  const alt = generateImageAlt(phrase);

  return (
    <figure className="phrase-image">
      <img
        src={phrase.image.url}
        alt={alt}
        className="phrase-image__img"
      />
      {/* 必須: 画像の下に説明文を表示 */}
      <figcaption className="phrase-image__caption">
        {caption}
      </figcaption>
    </figure>
  );
}
```

### HTML/CSS での実装例

```html
<figure class="phrase-image">
  <img
    src="/images/phrases/phrase-3-monkey-fall.jpg"
    alt="猿も木から落ちるの学習補助画像: どんなに得意な人でも失敗することがある"
    class="phrase-image__img"
  />
  <!-- 必須: 画像の下に説明文を表示 -->
  <figcaption class="phrase-image__caption">
    この画像は猿が木から落ちる様子を表しています。どんなに得意な人でも失敗することがあるという意味を視覚的に理解するためのものです。
  </figcaption>
</figure>
```

```css
.phrase-image {
  margin: 1.5rem 0;
  text-align: center;
}

.phrase-image__img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  background: #f5f5f5;
}

.phrase-image__caption {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.6;
  text-align: left;
  padding: 0 1rem;
}
```

---

## 説明文の生成

### 自動生成（推奨）

`generateImageCaption()` 関数を使用して、説明文を自動生成します。

```typescript
import { generateImageCaption } from './lib/image-selection';

const phrase: Phrase = {
  id: 3,
  phrase: '猿も木から落ちる',
  meaning: 'どんなに得意な人でも失敗することがある',
  // ...
};

const caption = generateImageCaption(phrase);
// 結果: "この画像は猿が木から落ちる様子を表しています。どんなに得意な人でも失敗することがあるという意味を視覚的に理解するためのものです。"
```

### 手動生成

自動生成が適切でない場合は、以下のフォーマットに従って手動で作成します。

```
この画像は[視覚要素]を表しています。[ことわざの意味]という意味を視覚的に理解するためのものです。
```

**視覚要素の例**:
- 「猿が木から落ちる様子」
- 「転倒して立ち上がる動作」
- 「石の上に座り続ける動作」
- 「継続的な動作」
- 「近道と遠回りの2つの道」

---

## UI実装のチェックリスト

画像をUIに組み込む際は、以下を必ず確認してください:

- [ ] 画像の下に説明文が表示されているか
- [ ] 説明文は指定されたフォーマットに従っているか
- [ ] 画像だけで意味を完結させていないか
- [ ] 学習者が「なぜこの画像なのか」理解できる構成か
- [ ] アクセシビリティ対応（alt属性）が設定されているか
- [ ] 画像が読み込めない場合のフォールバックがあるか

---

## アクセシビリティ対応

### alt属性の設定

画像には必ず適切な`alt`属性を設定してください。

```tsx
<img
  src={phrase.image.url}
  alt={generateImageAlt(phrase)}
  // ...
/>
```

**生成されるalt属性の例**:
- `猿も木から落ちるの学習補助画像: どんなに得意な人でも失敗することがある`

### スクリーンリーダー対応

`<figure>` と `<figcaption>` を使用することで、スクリーンリーダーが画像と説明文を適切に読み上げます。

```html
<figure>
  <img src="..." alt="..." />
  <figcaption>説明文</figcaption>
</figure>
```

---

## レイアウト例

### 基本レイアウト

```
┌─────────────────────────┐
│                         │
│       [画像]            │
│                         │
└─────────────────────────┘
  この画像は◯◯を表しています。
  ◯◯という意味を視覚的に理解
  するためのものです。
```

### カードレイアウト

```
┌─────────────────────────┐
│ ことわざ: 猿も木から落ちる│
│                         │
│       [画像]            │
│                         │
│  この画像は猿が木から    │
│  落ちる様子を表しています。│
│  どんなに得意な人でも    │
│  失敗することがあるという │
│  意味を視覚的に理解する  │
│  ためのものです。        │
└─────────────────────────┘
```

---

## エラーハンドリング

### 画像が読み込めない場合

```tsx
function PhraseImage({ phrase }: PhraseImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!phrase.image || imageError) {
    // 画像がない場合、または読み込みエラーの場合は説明文のみ表示
    return (
      <div className="phrase-image-fallback">
        <p className="phrase-image-fallback__text">
          {generateImageCaption(phrase)}
        </p>
      </div>
    );
  }

  return (
    <figure className="phrase-image">
      <img
        src={phrase.image.url}
        alt={generateImageAlt(phrase)}
        onError={() => setImageError(true)}
      />
      <figcaption>
        {generateImageCaption(phrase)}
      </figcaption>
    </figure>
  );
}
```

---

## まとめ

学習補助画像をUIに組み込む際は、以下を厳守してください:

1. **画像の下に必ず説明文を表示**
2. **説明文フォーマット**: 「この画像は◯◯を表しています。◯◯という意味を視覚的に理解するためのものです。」
3. **画像だけで意味を完結させない**
4. **学習者が「なぜこの画像なのか」理解できる構成**

`generateImageCaption()` 関数を使用することで、適切な説明文を自動生成できます。

