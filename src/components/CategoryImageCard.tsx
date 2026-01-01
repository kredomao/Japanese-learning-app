/**
 * 意味カテゴリ共通画像カードコンポーネント
 * 
 * 使用方法:
 * ```tsx
 * import { CategoryImageCard } from './components/CategoryImageCard';
 * 
 * <CategoryImageCard phrase={phrase} />
 * ```
 */

import { Phrase } from '../types';
import {
  getCategoryImageUrl,
  getCategoryImageAlt,
  getCategoryImageCaption,
} from '../lib/category-image';

interface CategoryImageCardProps {
  phrase: Phrase;
  className?: string;
}

/**
 * 意味カテゴリ共通画像カード
 */
export function CategoryImageCard({ phrase, className = '' }: CategoryImageCardProps) {
  const imageUrl = getCategoryImageUrl(phrase);
  
  // 画像が存在しない場合は表示しない
  if (!imageUrl) {
    return null;
  }

  const alt = getCategoryImageAlt(phrase);
  const caption = getCategoryImageCaption(phrase);

  return (
    <div className={`category-image-card ${className}`}>
      <figure className="category-image-card__figure">
        <img
          src={imageUrl}
          alt={alt}
          className="category-image-card__image"
          loading="lazy"
        />
        {/* 必須: 画像の下に補足テキストを表示 */}
        <figcaption className="category-image-card__caption">
          {caption}
        </figcaption>
      </figure>
    </div>
  );
}

