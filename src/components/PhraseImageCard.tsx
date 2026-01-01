/**
 * ことわざ・言い回しの学習補助画像カードコンポーネント
 * 
 * 使用方法:
 * ```tsx
 * import { PhraseImageCard } from './components/PhraseImageCard';
 * 
 * <PhraseImageCard phrase={phrase} />
 * ```
 */

import { Phrase } from '../types';
import { generateImageCaption, generateImageAlt } from '../lib/image-selection';

interface PhraseImageCardProps {
  phrase: Phrase;
  className?: string;
}

/**
 * ことわざ・言い回しの学習補助画像カード
 */
export function PhraseImageCard({ phrase, className = '' }: PhraseImageCardProps) {
  // 画像が存在しない場合は表示しない
  if (!phrase.image) {
    return null;
  }

  const caption = generateImageCaption(phrase);
  const alt = generateImageAlt(phrase);

  return (
    <div className={`phrase-image-card ${className}`}>
      <figure className="phrase-image-card__figure">
        <img
          src={phrase.image.url}
          alt={alt}
          className="phrase-image-card__image"
          loading="lazy"
        />
        {/* 必須: 画像の下に補足テキストを表示 */}
        <figcaption className="phrase-image-card__caption">
          {caption}
        </figcaption>
      </figure>
      
      {/* 画像の出典情報（フリー素材の場合） */}
      {phrase.image.attribution && (
        <div className="phrase-image-card__attribution">
          <small>
            Photo by{' '}
            {phrase.image.attribution.sourceUrl ? (
              <a
                href={phrase.image.attribution.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="phrase-image-card__link"
              >
                {phrase.image.attribution.author}
              </a>
            ) : (
              phrase.image.attribution.author
            )}
            {phrase.image.attribution.source === 'unsplash' && ' on Unsplash'}
            {phrase.image.attribution.source === 'pexels' && ' on Pexels'}
            {phrase.image.attribution.source === 'pixabay' && ' on Pixabay'}
          </small>
        </div>
      )}
    </div>
  );
}

