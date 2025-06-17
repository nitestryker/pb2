import { useState, useCallback } from 'react';
import { AISummary } from '../types';

interface UseAIReturn {
  isGenerating: boolean;
  error: string | null;
  generateSummary: (content: string, language: string) => Promise<AISummary | null>;
  clearError: () => void;
}

export const useAI = (): UseAIReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = useCallback(async (content: string, language: string): Promise<AISummary | null> => {
    if (!content.trim()) {
      setError('Content is required for AI analysis');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate AI processing with random delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

      // Mock AI summary generation
      const summaries = [
        "This code snippet implements a custom React hook for handling API calls with built-in loading, error, and data state management. It provides a clean abstraction for fetch operations and includes automatic cleanup to prevent memory leaks.",
        "A utility function that processes data arrays with filtering, sorting, and transformation capabilities. The implementation uses modern JavaScript features and follows functional programming principles for better maintainability.",
        "This component creates a reusable form handler with validation logic. It demonstrates proper state management, event handling, and error display patterns commonly used in React applications.",
        "A helper class that manages local storage operations with type safety and error handling. It provides methods for storing, retrieving, and removing data while handling serialization automatically.",
        "This algorithm implementation solves a specific computational problem using an efficient approach. The code includes proper error handling, input validation, and optimization techniques for better performance."
      ];

      const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
      const confidence = 0.75 + Math.random() * 0.24; // 75-99% confidence
      const tokens = Math.floor(50 + Math.random() * 150); // 50-200 tokens

      const aiSummary: AISummary = {
        id: Date.now().toString(),
        content: randomSummary,
        confidence: Math.round(confidence * 100) / 100,
        model: 'GPT-4',
        tokens,
        approved: false,
        createdAt: new Date().toISOString(),
        pasteId: ''
      };

      return aiSummary;
    } catch (err) {
      setError('Failed to generate AI summary. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isGenerating,
    error,
    generateSummary,
    clearError
  };
};