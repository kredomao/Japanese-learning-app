/**
 * AI例文生成 - 型定義
 */

// 生成リクエスト
export interface GenerateExampleRequest {
  phrase: string;          // ことわざ
  meaning: string;         // 意味
  userLevel: number;       // ユーザーレベル（難易度調整用）
  context?: string;        // 追加コンテキスト（オプション）
  count?: number;          // 生成数（デフォルト: 3）
}

// 生成結果
export interface GeneratedExample {
  sentence: string;        // 例文
  situation: string;       // 使用シチュエーション
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GenerateExampleResponse {
  success: boolean;
  examples: GeneratedExample[];
  error?: string;
}

// 会話形式の例文
export interface ConversationExample {
  speakers: {
    name: string;
    line: string;
  }[];
  context: string;         // 会話の背景
}

// ことわざ解説リクエスト
export interface ExplainPhraseRequest {
  phrase: string;
  userLevel: number;
  includeHistory?: boolean;    // 由来を含めるか
  includeRelated?: boolean;    // 関連ことわざを含めるか
}

export interface ExplainPhraseResponse {
  success: boolean;
  explanation: {
    simple: string;            // 簡単な説明
    detailed: string;          // 詳細な説明
    history?: string;          // 由来・歴史
    relatedPhrases?: string[]; // 関連ことわざ
    usageTips: string[];       // 使い方のコツ
  };
  error?: string;
}

// AIサービス設定
export interface AIServiceConfig {
  apiKey: string;
  model?: string;              // デフォルト: gpt-4o-mini
  maxTokens?: number;          // デフォルト: 1000
  temperature?: number;        // デフォルト: 0.7
}

