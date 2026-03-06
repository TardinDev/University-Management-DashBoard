import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type AIAction =
  | "improve"
  | "formal"
  | "simplify"
  | "expand"
  | "translate_en"
  | "generate_email"
  | "generate_announcement"
  | "generate_quiz"
  | "generate_response"
  | "generate_request"
  | "generate_portfolio"
  | "generate_description"
  | "generate_forum";

interface UseAIAssistReturn {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  generate: (action: AIAction, text: string, context?: string) => Promise<void>;
  reset: () => void;
}

export function useAIAssist(): UseAIAssistReturn {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (action: AIAction, text: string, context?: string) => {
      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetch(`${API_URL}/ai/assist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action, text, context }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            (data as { error?: string }).error || `Erreur ${res.status}`
          );
        }

        const data = (await res.json()) as { result: string };
        setResult(data.result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la génération"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isLoading, error, generate, reset };
}

export type { AIAction };
