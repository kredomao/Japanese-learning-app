/**
 * AI例文生成 API Route
 * POST /api/ai/generate-examples
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateExamples } from '@/lib/ai-service';
import { GenerateExampleRequest } from '@/types/ai';

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
    const body: GenerateExampleRequest = await request.json();

    // バリデーション
    if (!body.phrase || !body.meaning) {
      return NextResponse.json(
        { success: false, error: 'phrase and meaning are required' },
        { status: 400 }
      );
    }

    // 例文生成
    const result = await generateExamples(body, {
      apiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate examples error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

