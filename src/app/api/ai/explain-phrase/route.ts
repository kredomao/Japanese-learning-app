/**
 * ことわざ解説 API Route
 * POST /api/ai/explain-phrase
 */

import { NextRequest, NextResponse } from 'next/server';
import { explainPhrase } from '@/lib/ai-service';
import { ExplainPhraseRequest } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    // APIキーの確認
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // リクエストボディを取得
    const body: ExplainPhraseRequest = await request.json();

    // バリデーション
    if (!body.phrase) {
      return NextResponse.json(
        { success: false, error: 'phrase is required' },
        { status: 400 }
      );
    }

    // 解説生成
    const result = await explainPhrase(body, {
      apiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Explain phrase error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

