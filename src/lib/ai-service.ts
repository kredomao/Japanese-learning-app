/**
 * AI例文生成サービス
 * OpenAI APIとの連携を担当
 */

import {
  GenerateExampleRequest,
  GenerateExampleResponse,
  GeneratedExample,
  ExplainPhraseRequest,
  ExplainPhraseResponse,
  AIServiceConfig,
} from '../types/ai';

// デフォルト設定
const DEFAULT_CONFIG: Partial<AIServiceConfig> = {
  model: 'gpt-4o-mini',
  maxTokens: 1000,
  temperature: 0.7,
};

/**
 * ユーザーレベルに応じた難易度テキストを取得
 */
function getLevelDescription(level: number): string {
  if (level < 5) return '日本語初心者（N5-N4レベル）';
  if (level < 15) return '日本語初中級者（N4-N3レベル）';
  if (level < 30) return '日本語中級者（N3-N2レベル）';
  if (level < 50) return '日本語中上級者（N2レベル）';
  return '日本語上級者（N1レベル以上）';
}

/**
 * 例文生成用のプロンプトを構築
 */
function buildExamplePrompt(request: GenerateExampleRequest): string {
  const count = request.count || 3;
  const levelDesc = getLevelDescription(request.userLevel);

  return `あなたは日本語教育の専門家です。
以下のことわざ・言い回しを使った自然な例文を${count}個作成してください。

【ことわざ】${request.phrase}
【意味】${request.meaning}
【学習者レベル】${levelDesc}
${request.context ? `【追加コンテキスト】${request.context}` : ''}

## 出力形式（JSON）
必ず以下のJSON形式で出力してください。他のテキストは含めないでください。

{
  "examples": [
    {
      "sentence": "例文（ことわざを含む自然な文）",
      "situation": "この例文が使われるシチュエーション",
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}

## 注意事項
- 学習者のレベルに合わせた語彙・文法を使用
- 日常生活で実際に使えるシチュエーションで
- 各例文は異なるシチュエーションで
- difficultyは学習者レベルに対する相対的な難易度`;
}

/**
 * ことわざ解説用のプロンプトを構築
 */
function buildExplainPrompt(request: ExplainPhraseRequest): string {
  const levelDesc = getLevelDescription(request.userLevel);

  return `あなたは日本語教育と日本文化の専門家です。
以下のことわざについて、学習者向けに解説してください。

【ことわざ】${request.phrase}
【学習者レベル】${levelDesc}

## 出力形式（JSON）
必ず以下のJSON形式で出力してください。

{
  "simple": "一言で表す簡単な説明（30字以内）",
  "detailed": "詳しい説明（100-200字）"${request.includeHistory ? `,
  "history": "由来や歴史的背景（100字程度）"` : ''}${request.includeRelated ? `,
  "relatedPhrases": ["関連することわざ1", "関連することわざ2"]` : ''},
  "usageTips": [
    "使い方のコツ1",
    "使い方のコツ2"
  ]
}

## 注意事項
- 学習者のレベルに合わせた説明の難易度で
- 具体例を交えてわかりやすく
- 文化的背景も適度に含める`;
}

/**
 * OpenAI APIを呼び出す（サーバーサイド用）
 */
export async function callOpenAI(
  prompt: string,
  config: AIServiceConfig
): Promise<string> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: finalConfig.model,
      messages: [
        {
          role: 'system',
          content: 'あなたは日本語教育の専門家です。指定された形式でのみ回答してください。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: finalConfig.maxTokens,
      temperature: finalConfig.temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * JSONをパースする（エラーハンドリング付き）
 */
function parseJSON<T>(text: string): T | null {
  try {
    // コードブロックを除去
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    console.error('Failed to parse JSON:', text);
    return null;
  }
}

/**
 * 例文を生成（サーバーサイド用）
 */
export async function generateExamples(
  request: GenerateExampleRequest,
  config: AIServiceConfig
): Promise<GenerateExampleResponse> {
  try {
    const prompt = buildExamplePrompt(request);
    const response = await callOpenAI(prompt, config);

    const parsed = parseJSON<{ examples: GeneratedExample[] }>(response);

    if (!parsed || !parsed.examples) {
      return {
        success: false,
        examples: [],
        error: 'Failed to parse AI response',
      };
    }

    return {
      success: true,
      examples: parsed.examples,
    };
  } catch (error) {
    return {
      success: false,
      examples: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * ことわざを解説（サーバーサイド用）
 */
export async function explainPhrase(
  request: ExplainPhraseRequest,
  config: AIServiceConfig
): Promise<ExplainPhraseResponse> {
  try {
    const prompt = buildExplainPrompt(request);
    const response = await callOpenAI(prompt, config);

    const parsed = parseJSON<ExplainPhraseResponse['explanation']>(response);

    if (!parsed) {
      return {
        success: false,
        explanation: {
          simple: '',
          detailed: '',
          usageTips: [],
        },
        error: 'Failed to parse AI response',
      };
    }

    return {
      success: true,
      explanation: parsed,
    };
  } catch (error) {
    return {
      success: false,
      explanation: {
        simple: '',
        detailed: '',
        usageTips: [],
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * プロンプトビルダーをエクスポート（テスト・カスタマイズ用）
 */
export const prompts = {
  buildExamplePrompt,
  buildExplainPrompt,
  getLevelDescription,
};

