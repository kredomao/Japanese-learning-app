/**
 * 意味カテゴリ画像管理
 * カテゴリごとの共通画像を管理する
 */

import { Phrase, MeaningCategory } from '../types';
import { getMeaningCategory } from '../data/meaning-categories';

/**
 * ことわざの意味カテゴリに対応する画像URLを取得
 */
export function getCategoryImageUrl(phrase: Phrase): string | null {
  const category = getMeaningCategory(phrase.meaningCategory);
  return category.imageUrl || null;
}

/**
 * ことわざの意味カテゴリに対応する画像の代替テキストを取得
 */
export function getCategoryImageAlt(phrase: Phrase): string {
  const category = getMeaningCategory(phrase.meaningCategory);
  return category.imageAlt || `${category.name}の学習補助画像`;
}

/**
 * ことわざの意味カテゴリに対応する画像の説明文を生成
 */
export function getCategoryImageCaption(phrase: Phrase): string {
  const category = getMeaningCategory(phrase.meaningCategory);
  return `この画像は${category.imageConcept.split('。')[0]}を表しています。${phrase.meaning}という意味を視覚的に理解するためのものです。`;
}

/**
 * ことわざIDから意味カテゴリを取得（マッピング）
 */
export function getPhraseCategory(phraseId: number): MeaningCategory {
  const categoryMap: Record<number, MeaningCategory> = {
    1: 'persistence',        // 七転び八起き
    2: 'persistence',        // 石の上にも三年
    3: 'failure-learning',   // 猿も木から落ちる
    4: 'persistence',        // 継続は力なり
    5: 'wisdom-decision',    // 急がば回れ
    6: 'persistence',        // 塵も積もれば山となる
    7: 'wisdom-decision',    // 百聞は一見に如かず
    8: 'daily-life',         // 早起きは三文の徳
    9: 'action-challenge',   // 案ずるより産むが易し
    10: 'life-encounter',    // 笑う門には福来る
    11: 'action-challenge',  // 習うより慣れよ
    12: 'wisdom-decision',   // 一石二鳥
    13: 'failure-learning',  // 失敗は成功の母
    14: 'wisdom-decision',   // 三人寄れば文殊の知恵
    15: 'persistence',       // 千里の道も一歩から
    16: 'persistence',       // 好きこそ物の上手なれ
    17: 'relationship-growth', // 雨降って地固まる
    18: 'character-attitude', // 能ある鷹は爪を隠す
    19: 'wisdom-decision',   // 温故知新
    20: 'life-encounter',    // 一期一会
  };

  return categoryMap[phraseId] || 'persistence'; // デフォルト
}

