/**
 * 画像リサーチ・選定ヘルパー
 * 画像選定プロセスを支援する関数群
 */

import { Phrase, ImageSelectionInfo } from '../types';
import { getImageGuide } from './image-selection';

/**
 * 画像選定用の検索キーワードを生成
 * ステップ3で使用
 */
export function generateSearchKeywords(phrase: Phrase): string[] {
  const guide = getImageGuide(phrase.id);
  
  if (!guide) {
    // ガイドラインがない場合、ことわざの意味から推測
    return generateKeywordsFromMeaning(phrase);
  }

  // ガイドラインの必須要素から検索キーワードを生成
  return generateKeywordsFromGuide(guide, phrase);
}

/**
 * ガイドラインから検索キーワードを生成
 */
function generateKeywordsFromGuide(guide: any, phrase: Phrase): string[] {
  const keywords: string[] = [];
  
  // 必須要素から主要なキーワードを抽出
  for (const element of guide.requiredElements) {
    const elementKeywords = extractKeywordsFromElement(element);
    keywords.push(...elementKeywords);
  }

  // ことわざごとの固有キーワードを追加
  if (phrase.id === 3) {
    // 猿も木から落ちる
    keywords.push(
      'japanese macaque tree climbing',
      'monkey falling from tree natural',
      'wild monkey forest tree',
      'primate tree climbing realistic',
      'monkey tree habitat documentary',
    );
  } else if (phrase.id === 1) {
    // 七転び八起き
    keywords.push(
      'person falling getting up',
      'falling and standing up',
      'falling down getting up realistic',
      'person fall recovery',
    );
  } else if (phrase.id === 2) {
    // 石の上にも三年
    keywords.push(
      'person sitting on rock',
      'sitting on stone',
      'person on rock',
      'patience sitting',
    );
  } else if (phrase.id === 8) {
    // 早起きは三文の徳
    keywords.push(
      'early morning person window',
      'person waking up early morning',
      'morning sunlight window silhouette',
      'early morning peaceful activity',
      'dawn person reading window',
    );
  }

  // 重複を削除
  return Array.from(new Set(keywords));
}

/**
 * 要素からキーワードを抽出
 */
function extractKeywordsFromElement(element: string): string[] {
  const keywords: string[] = [];
  
  // 日本語から英語キーワードを推測（簡易版）
  if (element.includes('猿')) {
    keywords.push('monkey', 'primate', 'macaque');
  }
  if (element.includes('木')) {
    keywords.push('tree', 'forest');
  }
  if (element.includes('落ち')) {
    keywords.push('falling', 'fall');
  }
  if (element.includes('人')) {
    keywords.push('person', 'people', 'human');
  }
  if (element.includes('転倒')) {
    keywords.push('falling', 'trip', 'stumble');
  }
  if (element.includes('立ち上が')) {
    keywords.push('standing up', 'getting up', 'rise');
  }
  if (element.includes('石')) {
    keywords.push('rock', 'stone');
  }
  if (element.includes('座')) {
    keywords.push('sitting', 'sit');
  }

  return keywords;
}

/**
 * 意味から検索キーワードを生成（フォールバック）
 */
function generateKeywordsFromMeaning(phrase: Phrase): string[] {
  const keywords: string[] = [];
  const meaning = phrase.meaning.toLowerCase();
  
  // 意味から主要なキーワードを推測
  if (meaning.includes('猿') || meaning.includes('monkey')) {
    keywords.push('monkey', 'primate');
  }
  if (meaning.includes('木') || meaning.includes('tree')) {
    keywords.push('tree', 'forest');
  }
  if (meaning.includes('落ち') || meaning.includes('fall')) {
    keywords.push('falling', 'fall');
  }

  return keywords.length > 0 ? keywords : ['japanese proverb', 'educational image'];
}

/**
 * 画像選定情報のテンプレートを生成
 * 選定プロセスで使用
 */
export function generateImageSelectionTemplate(phrase: Phrase): Partial<ImageSelectionInfo> {
  const guide = getImageGuide(phrase.id);
  
  return {
    phraseId: phrase.id,
    meaning: phrase.meaning,
    realWorldSituation: guide
      ? `現実世界の状況: ${guide.requiredElements.join('、')}`
      : '現実世界の状況を定義してください',
    searchKeywords: generateSearchKeywords(phrase),
    selectedImageUrl: '',
    selectionReason: '',
    rejectedReasons: [],
    selectedAt: new Date().toISOString(),
  };
}

/**
 * フリー素材サイトの検索URLを生成
 */
export function generateSearchUrls(phrase: Phrase): {
  unsplash: string;
  pexels: string;
  pixabay: string;
} {
  const keywords = generateSearchKeywords(phrase);
  const primaryKeyword = keywords[0] || 'japanese proverb';
  
  return {
    unsplash: `https://unsplash.com/s/photos/${encodeURIComponent(primaryKeyword)}`,
    pexels: `https://www.pexels.com/search/${encodeURIComponent(primaryKeyword)}/`,
    pixabay: `https://pixabay.com/images/search/${encodeURIComponent(primaryKeyword)}/`,
  };
}

