import { useState, useEffect, useRef } from 'react';
import { Word } from '../types';

interface QuizCardProps {
  word: Word;
  currentIndex: number;
  totalCount: number;
  readAloud: boolean;
  onAnswer: (userAnswer: string, correct: boolean, manualCorrection: boolean) => void;
  speak: (text: string, lang: 'sv' | 'en') => void;
  onMount?: () => void;
}

type CardState = 'answering' | 'correct' | 'incorrect' | 'manual';

export function QuizCard({
  word,
  currentIndex,
  totalCount,
  readAloud,
  onAnswer,
  speak,
  onMount,
}: QuizCardProps) {
  const [userInput, setUserInput] = useState('');
  const [cardState, setCardState] = useState<CardState>('answering');
  const inputRef = useRef<HTMLInputElement>(null);
  const hasCalledOnMount = useRef(false);

  // Call onMount when card first appears (for auto-speaking Swedish word)
  useEffect(() => {
    if (!hasCalledOnMount.current && onMount) {
      hasCalledOnMount.current = true;
      onMount();
    }
  }, [onMount]);

  // Focus input when card appears or returns to answering state
  useEffect(() => {
    if (cardState === 'answering') {
      inputRef.current?.focus();
    }
  }, [cardState]);

  const checkAnswer = () => {
    const isCorrect =
      userInput.trim().toLowerCase() === word.english.trim().toLowerCase();

    if (isCorrect) {
      setCardState('correct');
    } else {
      setCardState('incorrect');
    }

    // Auto-speak English word after checking answer
    if (readAloud) {
      speak(word.english, 'en');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardState === 'answering' && userInput.trim()) {
      checkAnswer();
    }
  };

  const handleShowAnswer = () => {
    setCardState('manual');
    if (readAloud) {
      speak(word.english, 'en');
    }
  };

  const handleManualCorrection = (correct: boolean) => {
    onAnswer(userInput, correct, true);
  };

  const handleNext = () => {
    onAnswer(userInput, cardState === 'correct', false);
  };

  const handleSpeak = () => {
    speak(word.swedish, 'sv');
  };

  const handleSpeakEnglish = () => {
    speak(word.english, 'en');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress counter */}
      <div className="text-center text-gray-500 mb-4">
        Ord {currentIndex + 1} av {totalCount}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Swedish word */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">Svenska</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-3xl font-semibold text-gray-800">{word.swedish}</p>
            <button
              type="button"
              onClick={handleSpeak}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Läs upp svenska ordet"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Answer area */}
        {cardState === 'answering' && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="answer" className="block text-sm text-gray-500 mb-2">
                Engelska
              </label>
              <input
                ref={inputRef}
                id="answer"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full px-4 py-3 text-xl border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Skriv svaret..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="flex-1 py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Svara
              </button>
              <button
                type="button"
                onClick={handleShowAnswer}
                className="py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Rätta
              </button>
            </div>
          </form>
        )}

        {/* Correct answer */}
        {cardState === 'correct' && (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <p className="text-green-600 font-medium mb-1">Rätt!</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-semibold text-green-700">{word.english}</p>
                <button
                  type="button"
                  onClick={handleSpeakEnglish}
                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
                  aria-label="Läs upp engelska ordet"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 px-6 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Nästa
            </button>
          </div>
        )}

        {/* Incorrect answer */}
        {cardState === 'incorrect' && (
          <div className="text-center">
            <div className="mb-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-red-600 font-medium mb-1">Fel</p>
              <p className="text-sm text-gray-500 mb-2">
                Du skrev: <span className="text-red-600">{userInput}</span>
              </p>
              <p className="text-sm text-gray-500">Rätt svar:</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-semibold text-red-700">{word.english}</p>
                <button
                  type="button"
                  onClick={handleSpeakEnglish}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                  aria-label="Läs upp engelska ordet"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nästa
            </button>
          </div>
        )}

        {/* Manual correction mode */}
        {cardState === 'manual' && (
          <div className="text-center">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-blue-600 font-medium mb-1">Rätt svar:</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-semibold text-blue-700">{word.english}</p>
                <button
                  type="button"
                  onClick={handleSpeakEnglish}
                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                  aria-label="Läs upp engelska ordet"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleManualCorrection(false)}
                className="flex-1 py-3 px-6 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
              >
                Fel
              </button>
              <button
                onClick={() => handleManualCorrection(true)}
                className="flex-1 py-3 px-6 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition-colors"
              >
                Rätt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
