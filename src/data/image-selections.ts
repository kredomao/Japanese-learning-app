/**
 * 画像選定情報データ
 * 各ことわざ・言い回しの画像選定プロセスと結果を記録
 */

import { ImageSelectionInfo } from '../types';

/**
 * 画像選定情報の一覧
 * 選定プロセスに従って、各フレーズの画像選定情報を記録
 */
export const IMAGE_SELECTIONS: Record<number, ImageSelectionInfo> = {
  // 早起きは三文の徳（id: 8）
  8: {
    phraseId: 8,
    meaning: '早起きをすると、少しだが良いことがある',
    realWorldSituation: '早朝（日の出の時間帯）に、人が起きて活動を始めている様子。背景は朝の光が差し込む窓や、早朝の静かな風景。人はシルエットまたは後ろ姿で、具体的な活動（読書、散歩、朝食の準備など）をしている。時間の余裕や静けさが感じられる構図。',
    searchKeywords: [
      'early morning person window',
      'person waking up early morning',
      'morning sunlight window silhouette',
      'early morning peaceful activity',
      'dawn person reading window',
    ],
    selectedImageUrl: '', // TODO: 実際の画像URLを追加
    selectionReason: '早朝であることが明確で、人が活動を始めている様子が分かる。過度にドラマチックではなく、誤解を生まないシンプルな構図。時間の余裕や静けさが感じられ、「少しだが良いこと」という意味が視覚的に理解できる。',
    rejectedReasons: [
      '過度にドラマチックな朝日の画像は、「少しだが良いこと」という控えめな表現とズレるため除外',
      '特定の職業が強調された画像は、ことわざの普遍的な意味が伝わらないため除外',
      '装飾的な要素が含まれた画像は、学習に不要な情報が含まれるため除外',
      '感情表現が強調された画像は、「少しだが良いこと」という控えめな表現とズレるため除外',
      '抽象的・比喩的な画像は、ことわざの具体的な意味が伝わらないため除外',
    ],
    selectedAt: new Date().toISOString(),
    selectedBy: 'system',
  },

  // 例: 猿も木から落ちる（id: 3）
  // 実際の画像URLは、選定プロセスに従って追加してください
  3: {
    phraseId: 3,
    meaning: '猿は木登りが得意な動物だが、それでも落ちることがある。これは、どんなに得意なことでも失敗することがあるという意味を表す。',
    realWorldSituation: '自然環境で、猿が木に登っている様子（得意なこと）、または木から落ちた後の様子（失敗）。猿は冷静に状況を把握し、再び立ち上がろうとしている。',
    searchKeywords: [
      'japanese macaque tree climbing',
      'monkey falling from tree natural',
      'wild monkey forest tree',
      'primate tree climbing realistic',
      'monkey tree habitat documentary',
    ],
    selectedImageUrl: '', // TODO: 実際の画像URLを追加
    selectionReason: '猿が木に登っている様子と落ちた後の様子が明確に表現されている。背景はシンプルで、装飾的要素がない。現実に近い状況を描写している。',
    rejectedReasons: [
      '可愛い表現の画像は、ことわざの真意（失敗は自然なこと）が伝わらないため除外',
      'アニメ風のイラストは、現実に近い状況ではないため除外',
      '装飾的な背景の画像は、学習に不要な情報が含まれるため除外',
      '猿が不器用に見える画像は、「猿は木登りが得意」という前提が伝わらないため除外',
    ],
    selectedAt: new Date().toISOString(),
    selectedBy: 'system',
  },
};

/**
 * フレーズIDに対応する画像選定情報を取得
 */
export function getImageSelection(phraseId: number): ImageSelectionInfo | null {
  return IMAGE_SELECTIONS[phraseId] || null;
}

/**
 * 画像選定情報を追加・更新
 */
export function setImageSelection(info: ImageSelectionInfo): void {
  IMAGE_SELECTIONS[info.phraseId] = {
    ...info,
    selectedAt: info.selectedAt || new Date().toISOString(),
  };
}

