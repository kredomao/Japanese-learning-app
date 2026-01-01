/**
 * 学習補助画像選定ヘルパー
 * 画像選定ガイドラインに基づいて、適切な画像を選定・検証する
 */

import { Phrase, ImageSelectionGuide, FORBIDDEN_IMAGE_EXPRESSIONS, REQUIRED_IMAGE_REQUIREMENTS } from '../types';

/**
 * 画像生成・選定時の禁止表現チェックリスト
 * これらの表現は絶対に使用しないでください
 */
export const FORBIDDEN_EXPRESSIONS = FORBIDDEN_IMAGE_EXPRESSIONS;

/**
 * 画像生成・選定時の必須要件
 */
export const REQUIRED_REQUIREMENTS = REQUIRED_IMAGE_REQUIREMENTS;

/**
 * ことわざ・言い回しごとの画像選定ガイドライン
 * 画像を選定・生成する際の基準を定義
 */
export const PHRASE_IMAGE_GUIDES: Record<number, ImageSelectionGuide> = {
  // 七転び八起き
  1: {
    purpose: '「転倒して立ち上がる動作」を視覚的に理解させる',
    requiredElements: [
      '人が転倒している様子（現実に近い状況）',
      '同じ人が立ち上がろうとしている様子（現実に近い状況）',
      '複数回の転倒と立ち上がりを示す連続的な動作（可能であれば）',
    ],
    forbiddenElements: [
      'かわいい表現',
      'キャラクターやアニメ風のイラスト',
      'デフォルメ表現',
      'ファンタジー要素',
      '面白おかしい表現',
      '抽象的・比喩的な表現（例: 階段を上る、山を登るなど）',
      'メタファーのみで表現',
      '装飾的な背景や効果',
      '感情表現（笑顔、悲しみなど）',
      '特定の職業や状況（ビジネス、スポーツなど）',
    ],
    recommendedType: 'photo',
    notes: '実写写真（必須）: 現実に近い状況を描写。シルエットまたは後ろ姿で、転倒→立ち上がりの連続動作。または、シンプルな線画イラスト: 現実的な人のシルエットが転倒し、立ち上がる様子。装飾は一切なし。',
  },

  // 石の上にも三年
  2: {
    purpose: '「石の上に座り続ける動作」を視覚的に理解させる',
    requiredElements: [
      '石（または岩）',
      '人が石の上に座っている様子（現実に近い状況）',
      '長時間座り続けている様子（可能であれば時間の経過を示す）',
    ],
    forbiddenElements: [
      'かわいい表現',
      'キャラクターやアニメ風のイラスト',
      'デフォルメ表現',
      'ファンタジー要素',
      '面白おかしい表現',
      '抽象的・比喩的な表現（例: 時計、カレンダーなど）',
      'メタファーのみで表現',
      '装飾的な背景や効果',
      '感情表現（辛そう、我慢しているなど）',
      '特定の職業や状況（修行、瞑想など）',
    ],
    recommendedType: 'photo',
    notes: '実写写真（必須）: 現実に近い状況を描写。白背景または自然背景で、石の上に座る人のシルエット。または、シンプルな線画イラスト: 現実的な石と人のシルエット。装飾は一切なし。',
  },

  // 猿も木から落ちる
  3: {
    purpose: '「猿は木登りが得意だが、それでも落ちることがある」という事実を通じて、「得意なことでも失敗することがある」という意味を視覚的に理解させる',
    requiredElements: [
      '猿（実物の猿: ニホンザル、チンパンジーなど）',
      '木（実際の木: 針葉樹または広葉樹）',
      '猿が木に登っている様子（落ちる前: 得意そうな様子）',
      '猿が落ちた瞬間または落ちた直後の様子',
      '猿は冷静に状況を把握している、または再び立ち上がろうとしている（失敗→学びの文脈）',
    ],
    forbiddenElements: [
      'かわいい表現',
      'キャラクターやアニメ風のイラスト（可愛い、面白い表現）',
      'デフォルメ表現（コミカルなポーズや表情）',
      'ファンタジー要素',
      '面白おかしい表現',
      '抽象的・比喩的な表現（例: 人間が失敗している様子、×マーク、矢印など）',
      'メタファーのみで表現',
      '装飾的な背景や効果（カラフルな背景、イラスト風の雲や星など）',
      '感情表現の強調（痛そう、悲しそう、驚いた表情、汗、涙など）',
      '猿が不器用に見える表現（不器用に登ろうとしている、初めて登る様子など）',
      '人間の失敗シーン（意味がズレる）',
      '「失敗は悪いこと」という印象を与える表現',
    ],
    recommendedType: 'photo',
    notes: '実写写真（必須）: 現実に近い状況を描写。自然環境で、左側に猿が木に登っている様子、右側に落ちた後の様子を横並びで表示。猿は冷静に状況を把握し、再び立ち上がろうとしている。背景は白または自然環境（シンプルに）。または、シンプルな線画イラスト: 現実的な猿と木のシルエット、登る→落ちる→立ち上がるの連続的な動作。装飾は一切なし。最重要: 猿が落ちることを面白おかしく描かず、失敗→学びという文脈が分かること。現実に近い状況のみを描写すること。',
  },

  // 継続は力なり
  4: {
    purpose: '「継続的な動作」を視覚的に理解させる',
    requiredElements: [
      '同じ動作を繰り返している様子（例: 毎日の運動、勉強など）（現実に近い状況）',
      '時間の経過を示す要素（可能であれば）',
    ],
    forbiddenElements: [
      'かわいい表現',
      'キャラクターやアニメ風のイラスト',
      'デフォルメ表現',
      'ファンタジー要素',
      '面白おかしい表現',
      '抽象的・比喩的な表現（例: 成長の階段、光など）',
      'メタファーのみで表現',
      '装飾的な背景や効果',
      '感情表現（頑張っている、達成感など）',
      '特定の職業や状況（アスリート、学生など）',
    ],
    recommendedType: 'photo',
    notes: '実写写真（必須）: 現実に近い状況を描写。白背景で、同じ動作を繰り返す人のシルエット（連続写真風）。または、シンプルな線画イラスト: 現実的な同じ動作を繰り返す人のシルエット。装飾は一切なし。',
  },

  // 急がば回れ
  5: {
    purpose: '「近道と遠回り」を視覚的に理解させる',
    requiredElements: [
      '2つの道（近道と遠回り）（現実に近い状況）',
      '近道が危険または困難である様子',
      '遠回りが安全である様子',
    ],
    forbiddenElements: [
      'かわいい表現',
      'キャラクターやアニメ風のイラスト',
      'デフォルメ表現',
      'ファンタジー要素',
      '面白おかしい表現',
      '抽象的・比喩的な表現（例: 時計、矢印など）',
      'メタファーのみで表現',
      '装飾的な背景や効果',
      '感情表現（焦り、安心など）',
      '特定の職業や状況（ビジネス、スポーツなど）',
    ],
    recommendedType: 'illustration',
    notes: '実写写真（必須）: 現実に近い状況を描写。地図または実際の道の写真（近道が険しい、遠回りが平坦）。または、シンプルな線画イラスト: 現実的な2つの道を示す地図風の図。装飾は一切なし。',
  },

  // 早起きは三文の徳
  8: {
    purpose: '「早朝に起きて活動を始めている様子」を視覚的に理解させる',
    requiredElements: [
      '早朝（日の出の時間帯）であることが明確（朝の光が差し込んでいる）',
      '人が早朝に起きて活動を始めている様子（シルエットまたは後ろ姿）',
      '具体的な活動（読書、散歩、朝食の準備など）をしている',
      '時間の余裕や静けさが感じられる構図',
      '背景は白またはシンプル（朝の光が感じられる）',
    ],
    forbiddenElements: [
      'かわいい表現',
      'キャラクターやアニメ風のイラスト',
      'デフォルメ表現',
      'ファンタジー要素',
      '面白おかしい表現',
      '抽象的・比喩的な表現（例: 時計、カレンダーなど）',
      'メタファーのみで表現',
      '装飾的な背景や効果（カラフルな背景、光のエフェクトなど）',
      '感情表現の強調（笑顔、達成感など）',
      '過度にドラマチックな構図（大きな朝日、劇的な光など）',
      '特定の職業や状況が強調されている（ビジネスパーソン、学生など）',
    ],
    recommendedType: 'photo',
    notes: '実写写真（必須）: 現実に近い状況を描写。早朝（日の出の時間帯）に、人が起きて活動を始めている様子。背景は朝の光が差し込む窓や、早朝の静かな風景。人はシルエットまたは後ろ姿で、具体的な活動（読書、散歩、朝食の準備など）をしている。時間の余裕や静けさが感じられる構図。過度にドラマチックではなく、誤解を生まないシンプルな構図。装飾は一切なし。',
  },
};

/**
 * フレーズIDに対応する画像選定ガイドラインを取得
 */
export function getImageGuide(phraseId: number): ImageSelectionGuide | null {
  return PHRASE_IMAGE_GUIDES[phraseId] || null;
}

/**
 * 画像がガイドラインに適合しているか検証
 * （開発・デバッグ用）
 */
export function validateImage(
  phrase: Phrase,
  imageUrl: string
): {
  isValid: boolean;
  issues: string[];
  guide: ImageSelectionGuide | null;
} {
  const guide = getImageGuide(phrase.id);
  const issues: string[] = [];

  if (!guide) {
    return {
      isValid: false,
      issues: ['このフレーズには画像選定ガイドラインが定義されていません'],
      guide: null,
    };
  }

  // 実際の画像検証は実装しない（外部サービスやAIを使用）
  // ここではガイドラインの存在確認のみ

  return {
    isValid: issues.length === 0,
    issues,
    guide,
  };
}

/**
 * 画像の説明文を生成（意味との対応関係）
 * 開発者向けの詳細説明
 */
export function generateImageDescription(phrase: Phrase): string {
  const guide = getImageGuide(phrase.id);
  
  if (!guide) {
    return `${phrase.phrase}の意味を視覚的に理解するための画像`;
  }

  return `${phrase.phrase}（${phrase.meaning}）を理解するための画像。${guide.purpose}`;
}

/**
 * UI表示用の画像説明文を生成
 * フォーマット: 「この画像は◯◯を表しています。◯◯という意味を視覚的に理解するためのものです。」
 */
export function generateImageCaption(phrase: Phrase): string {
  const guide = getImageGuide(phrase.id);
  
  if (!guide) {
    // ガイドラインがない場合のフォールバック
    const visualElement = extractVisualElement(phrase);
    return `この画像は${visualElement}を表しています。${phrase.meaning}という意味を視覚的に理解するためのものです。`;
  }

  // ガイドラインから視覚要素を抽出
  const visualElement = extractVisualElementFromGuide(guide, phrase);
  
  return `この画像は${visualElement}を表しています。${phrase.meaning}という意味を視覚的に理解するためのものです。`;
}

/**
 * ガイドラインから視覚要素を抽出
 */
function extractVisualElementFromGuide(guide: ImageSelectionGuide, phrase: Phrase): string {
  // ガイドラインの必須要素から主要な視覚要素を抽出
  const mainElement = guide.requiredElements[0] || 'ことわざの意味';
  
  // ことわざごとに適切な表現に調整
  if (phrase.id === 1) {
    return '転倒して立ち上がる動作';
  } else if (phrase.id === 2) {
    return '石の上に座り続ける動作';
  } else if (phrase.id === 3) {
    return '猿が木から落ちる様子';
  } else if (phrase.id === 4) {
    return '継続的な動作';
  } else if (phrase.id === 5) {
    return '近道と遠回りの2つの道';
  }
  
  // デフォルト: 最初の必須要素を使用
  return mainElement.replace(/（.*?）/g, '').replace(/（.*?）/g, '');
}

/**
 * ガイドラインがない場合の視覚要素抽出
 */
function extractVisualElement(phrase: Phrase): string {
  // ことわざの文字列から推測
  if (phrase.phrase.includes('猿')) {
    return '猿と木';
  } else if (phrase.phrase.includes('石')) {
    return '石と人';
  } else if (phrase.phrase.includes('転')) {
    return '転倒と立ち上がり';
  }
  
  return 'ことわざの意味';
}

/**
 * 画像の代替テキストを生成（アクセシビリティ用）
 */
export function generateImageAlt(phrase: Phrase): string {
  return `${phrase.phrase}の学習補助画像: ${phrase.meaning}`;
}

/**
 * 画像生成プロンプト用の禁止表現チェックリストを取得
 * AI画像生成時に使用する
 */
export function getForbiddenExpressionsForPrompt(): string {
  return `以下の表現は絶対に使用禁止です:
- かわいい
- キャラクター
- デフォルメ
- ファンタジー
- 面白おかしい
- 抽象的
- メタファーのみで表現

画像は必ず「現実に近い状況」を描写してください。`;
}

/**
 * 画像生成プロンプト用の必須要件を取得
 * AI画像生成時に使用する
 */
export function getRequiredRequirementsForPrompt(): string {
  return `以下の要件を必ず満たしてください:
- 現実に近い状況を描写する
- 実写写真または現実的なイラストのみ
- 装飾的要素は一切含めない`;
}

/**
 * 画像生成プロンプトを生成
 * AI画像生成サービスで使用する
 */
export function generateImagePrompt(phrase: Phrase): string {
  const guide = getImageGuide(phrase.id);
  
  if (!guide) {
    return `Generate a realistic educational image for the Japanese proverb "${phrase.phrase}" (${phrase.meaning}).

${getRequiredRequirementsForPrompt()}

${getForbiddenExpressionsForPrompt()}`;
  }

  const requiredElements = guide.requiredElements.join('\n- ');
  const forbiddenElements = guide.forbiddenElements.join('\n- ');

  return `Generate a realistic educational image for the Japanese proverb "${phrase.phrase}" (${phrase.meaning}).

Purpose: ${guide.purpose}

Required elements:
- ${requiredElements}

${getRequiredRequirementsForPrompt()}

Forbidden elements:
- ${forbiddenElements}

${getForbiddenExpressionsForPrompt()}

Image type: ${guide.recommendedType === 'photo' ? 'Realistic photograph' : 'Realistic illustration'}
Background: White or simple solid color
Style: Documentary, educational, no decoration`;
}

/**
 * 画像レビュー結果の型定義
 */
export interface ImageReviewResult {
  phrase: Phrase;
  overallRating: 'appropriate' | 'needs-improvement' | 'inappropriate';
  checks: {
    meaningMatch: {
      rating: 'appropriate' | 'inappropriate';
      reason: string;
      improvement?: string;
    };
    noMisunderstanding: {
      rating: 'appropriate' | 'inappropriate';
      reason: string;
      improvement?: string;
    };
    noExtraInfo: {
      rating: 'appropriate' | 'inappropriate';
      reason: string;
      improvement?: string;
    };
    clearDirection: {
      rating: 'appropriate' | 'inappropriate';
      reason: string;
      improvement?: string;
    };
  };
  forbiddenExpressions: string[];
  missingRequirements: string[];
  recommendation: 'use' | 'improve' | 'reject';
}

/**
 * 画像レビュー用のチェックリストを取得
 * 手動レビュー時に使用する
 */
export function getImageReviewChecklist(phrase: Phrase): {
  phrase: Phrase;
  guide: ImageSelectionGuide | null;
  checklist: {
    meaningMatch: string[];
    noMisunderstanding: string[];
    noExtraInfo: string[];
    clearDirection: string[];
  };
  forbiddenExpressions: readonly string[];
  requiredRequirements: readonly string[];
} {
  const guide = getImageGuide(phrase.id);

  return {
    phrase,
    guide,
    checklist: {
      meaningMatch: [
        '画像がことわざ・言い回しの意味と完全に一致しているか',
        '画像を見て、ことわざの意味が理解できるか',
        '意味とズレる要素が含まれていないか',
        '間接的・連想的な表現ではなく、直接的な表現か',
      ],
      noMisunderstanding: [
        '初学者が見て、正しい意味を理解できるか',
        '誤解を招く要素が含まれていないか',
        '文化的背景の知識がなくても理解できるか',
        '画像だけで方向性が分かるか',
      ],
      noExtraInfo: [
        '学習に不要な装飾的要素が含まれていないか',
        '背景がシンプル（白 or 単色）か',
        '感情表現が過度に強調されていないか',
        '特定の職業・状況・文化が強調されていないか',
      ],
      clearDirection: [
        '画像だけで、ことわざの意味の方向性が分かるか',
        '画像を見て、正しい意味に導かれるか',
        '説明文がなくても、誤解しないか',
      ],
    },
    forbiddenExpressions: FORBIDDEN_EXPRESSIONS,
    requiredRequirements: REQUIRED_REQUIREMENTS,
  };
}

