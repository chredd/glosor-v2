import { useState, useEffect, useRef, useCallback } from 'react';
import { Word, Answer } from '../types';
import { shuffleArray } from '../utils/csv';
import { QuizCard } from './QuizCard';

interface QuizProps {
  words: Word[];
  readAloud: boolean;
  speak: (text: string, lang: 'sv' | 'en') => void;
  onComplete: (answers: Answer[]) => void;
}

export function Quiz({ words, readAloud, speak, onComplete }: QuizProps) {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isReady, setIsReady] = useState(false);
  const hasShuffledRef = useRef(false);
  const wordsIdRef = useRef<string>('');

  // Create a stable ID for the words array
  const wordsId = words.map((w) => w.swedish).join(',');

  useEffect(() => {
    // Only shuffle if words changed (not on StrictMode remount)
    if (wordsId !== wordsIdRef.current) {
      wordsIdRef.current = wordsId;
      hasShuffledRef.current = false;
    }

    if (!hasShuffledRef.current && words.length > 0) {
      hasShuffledRef.current = true;
      const shuffled = shuffleArray(words);
      setShuffledWords(shuffled);
      setCurrentIndex(0);
      setAnswers([]);
      setIsReady(true);
    }
  }, [words, wordsId]);

  // Auto-speak Swedish word when card changes (after user interaction on previous card)
  const speakCurrentWord = useCallback(() => {
    if (readAloud && shuffledWords.length > 0 && isReady) {
      speak(shuffledWords[currentIndex].swedish, 'sv');
    }
  }, [readAloud, shuffledWords, currentIndex, isReady, speak]);

  const handleAnswer = (
    userAnswer: string,
    correct: boolean,
    manualCorrection: boolean
  ) => {
    const newAnswer: Answer = {
      word: shuffledWords[currentIndex],
      userAnswer,
      correct,
      manualCorrection,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentIndex + 1 >= shuffledWords.length) {
      onComplete(newAnswers);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Don't render until shuffle is complete
  if (!isReady || shuffledWords.length === 0) {
    return null;
  }

  return (
    <QuizCard
      key={currentIndex}
      word={shuffledWords[currentIndex]}
      currentIndex={currentIndex}
      totalCount={shuffledWords.length}
      readAloud={readAloud}
      onAnswer={handleAnswer}
      speak={speak}
      onMount={speakCurrentWord}
    />
  );
}
