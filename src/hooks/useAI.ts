/**
 * AI機能用 React Hooks
 * 例文生成・ことわざ解説をUIから簡単に使えるようにする
 */

import { useState, useCallback } from 'react';
import {
  GenerateExampleRequest,
  GenerateExampleResponse,
  GeneratedExample,
  ExplainPhraseRequest,
  ExplainPhraseResponse,
} from '../types/ai';
import { Phrase } from '../types';

// ============================================
// 🎯 例文生成フック
// ============================================

interface UseExampleGeneratorOptions {
  onSuccess?: (examples: GeneratedExample[]) => void;
  onError?: (error: string) => void;
}

export function useExampleGenerator(options: UseExampleGeneratorOptions = {}) {
  const [examples, setExamples] = useState<GeneratedExample[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (phrase: Phrase, userLevel: number, count: number = 3) => {
      setIsLoading(true);
      setError(null);

      try {
        const request: GenerateExampleRequest = {
          phrase: phrase.phrase,
          meaning: phrase.meaning,
          userLevel,
          count,
        };

        const response = await fetch('/api/ai/generate-examples', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        const data: GenerateExampleResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to generate examples');
        }

        setExamples(data.examples);
        options.onSuccess?.(data.examples);
        return data.examples;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        options.onError?.(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const clear = useCallback(() => {
    setExamples([]);
    setError(null);
  }, []);

  return {
    examples,
    isLoading,
    error,
    generate,
    clear,
  };
}

// ============================================
// 📖 ことわざ解説フック
// ============================================

interface UsePhraseExplainerOptions {
  includeHistory?: boolean;
  includeRelated?: boolean;
  onSuccess?: (explanation: ExplainPhraseResponse['explanation']) => void;
  onError?: (error: string) => void;
}

export function usePhraseExplainer(options: UsePhraseExplainerOptions = {}) {
  const [explanation, setExplanation] = useState<ExplainPhraseResponse['explanation'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const explain = useCallback(
    async (phrase: string, userLevel: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const request: ExplainPhraseRequest = {
          phrase,
          userLevel,
          includeHistory: options.includeHistory ?? true,
          includeRelated: options.includeRelated ?? true,
        };

        const response = await fetch('/api/ai/explain-phrase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        const data: ExplainPhraseResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to explain phrase');
        }

        setExplanation(data.explanation);
        options.onSuccess?.(data.explanation);
        return data.explanation;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        options.onError?.(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const clear = useCallback(() => {
    setExplanation(null);
    setError(null);
  }, []);

  return {
    explanation,
    isLoading,
    error,
    explain,
    clear,
  };
}

// ============================================
// 🔄 キャッシュ付き例文生成フック
// ============================================

const exampleCache = new Map<string, GeneratedExample[]>();

export function useCachedExampleGenerator() {
  const [examples, setExamples] = useState<GeneratedExample[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const generate = useCallback(
    async (phrase: Phrase, userLevel: number, count: number = 3) => {
      const cacheKey = `${phrase.id}-${userLevel}-${count}`;

      // キャッシュチェック
      if (exampleCache.has(cacheKey)) {
        const cached = exampleCache.get(cacheKey)!;
        setExamples(cached);
        setFromCache(true);
        return cached;
      }

      setIsLoading(true);
      setError(null);
      setFromCache(false);

      try {
        const request: GenerateExampleRequest = {
          phrase: phrase.phrase,
          meaning: phrase.meaning,
          userLevel,
          count,
        };

        const response = await fetch('/api/ai/generate-examples', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        const data: GenerateExampleResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to generate examples');
        }

        // キャッシュに保存
        exampleCache.set(cacheKey, data.examples);
        setExamples(data.examples);
        return data.examples;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearCache = useCallback(() => {
    exampleCache.clear();
  }, []);

  return {
    examples,
    isLoading,
    error,
    fromCache,
    generate,
    clearCache,
  };
}

// ============================================
// 🎮 学習と連携したAIフック
// ============================================

interface UseAILearningOptions {
  autoGenerateOnNew?: boolean;  // 新しいフレーズで自動生成
  exampleCount?: number;
}

export function useAILearning(
  currentPhrase: Phrase | null,
  userLevel: number,
  options: UseAILearningOptions = {}
) {
  const { autoGenerateOnNew = false, exampleCount = 3 } = options;

  const exampleGenerator = useCachedExampleGenerator();
  const phraseExplainer = usePhraseExplainer({
    includeHistory: true,
    includeRelated: true,
  });

  // 例文を生成
  const generateExamples = useCallback(async () => {
    if (!currentPhrase) return [];
    return exampleGenerator.generate(currentPhrase, userLevel, exampleCount);
  }, [currentPhrase, userLevel, exampleCount, exampleGenerator]);

  // 解説を生成
  const explainCurrentPhrase = useCallback(async () => {
    if (!currentPhrase) return null;
    return phraseExplainer.explain(currentPhrase.phrase, userLevel);
  }, [currentPhrase, userLevel, phraseExplainer]);

  return {
    // 例文
    examples: exampleGenerator.examples,
    examplesLoading: exampleGenerator.isLoading,
    examplesError: exampleGenerator.error,
    examplesFromCache: exampleGenerator.fromCache,
    generateExamples,

    // 解説
    explanation: phraseExplainer.explanation,
    explanationLoading: phraseExplainer.isLoading,
    explanationError: phraseExplainer.error,
    explainCurrentPhrase,

    // ユーティリティ
    clearCache: exampleGenerator.clearCache,
    isAnyLoading: exampleGenerator.isLoading || phraseExplainer.isLoading,
  };
}

