import { useState, useEffect } from 'react';
import { Word } from '../types';
import { parseCSV } from '../utils/csv';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSGyTUbefM_SCBRSi-oaA1mUu9OoMocErw-iW3LwKcW5YjRgL16WwF3WtymFcANjomFGcgLtfEzNQw6/pub?output=csv';

interface UseVocabularyResult {
  words: Word[];
  loading: boolean;
  error: string | null;
}

export function useVocabulary(): UseVocabularyResult {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVocabulary() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(SHEET_URL);
        if (!response.ok) {
          throw new Error(`Kunde inte ladda glosor: ${response.status}`);
        }

        const csv = await response.text();
        const parsedWords = parseCSV(csv);

        if (parsedWords.length === 0) {
          throw new Error('Inga glosor hittades i dokumentet');
        }

        setWords(parsedWords);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      } finally {
        setLoading(false);
      }
    }

    fetchVocabulary();
  }, []);

  return { words, loading, error };
}
