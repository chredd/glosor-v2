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

  // Progress percentage for visual bar
  const progressPercent = ((currentIndex + 1) / totalCount) * 100;

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/90 text-sm font-medium">
            Ord {currentIndex + 1} av {totalCount}
          </span>
          <span className="text-white/90 text-sm font-bold">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 card-glow ${
          cardState === 'correct'
            ? 'animate-bounce-in'
            : cardState === 'incorrect'
            ? 'animate-shake'
            : ''
        }`}
      >
        {/* Swedish word */}
        <div className="text-center mb-8">
          <p className="text-sm text-purple-500 font-bold mb-2 uppercase tracking-wide">
            🇸🇪 Svenska
          </p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-3xl font-black gradient-text">{word.swedish}</p>
            <button
              type="button"
              onClick={handleSpeak}
              className="p-3 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-full transition-all hover:scale-110"
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
              <label
                htmlFor="answer"
                className="block text-sm text-purple-500 font-bold mb-2 uppercase tracking-wide"
              >
                🇬🇧 Engelska
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
                className="w-full px-5 py-4 text-xl border-3 border-purple-200 rounded-2xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all bg-purple-50/50 font-medium"
                placeholder="Skriv svaret här..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="flex-1 py-4 px-6 fun-button text-white font-bold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transition-all text-lg"
              >
                Kolla! ✨
              </button>
              <button
                type="button"
                onClick={handleShowAnswer}
                className="py-4 px-6 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all hover:scale-105"
              >
                🤔 Visa
              </button>
            </div>
          </form>
        )}

        {/* Correct answer */}
        {cardState === 'correct' && (
          <div className="text-center">
            <div className="mb-6 p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300">
              <div className="text-5xl mb-2">🎉</div>
              <p className="text-green-600 font-black text-xl mb-2">
                RÄTT! Snyggt jobbat!
              </p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-bold text-green-700">
                  {word.english}
                </p>
                <button
                  type="button"
                  onClick={handleSpeakEnglish}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full transition-all hover:scale-110"
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
              className="w-full py-4 px-6 success-button text-white font-bold rounded-2xl transition-all text-lg hover:scale-[1.02]"
            >
              Nästa ord 👉
            </button>
          </div>
        )}

        {/* Incorrect answer */}
        {cardState === 'incorrect' && (
          <div className="text-center">
            <div className="mb-6 p-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl border-2 border-orange-300">
              <div className="text-5xl mb-2">😅</div>
              <p className="text-orange-600 font-black text-xl mb-2">
                Nästan! Försök igen nästa gång
              </p>
              <p className="text-sm text-gray-500 mb-3">
                Du skrev:{' '}
                <span className="text-orange-600 font-medium line-through">
                  {userInput}
                </span>
              </p>
              <p className="text-sm text-gray-500">Rätt svar:</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-bold text-green-600">
                  {word.english}
                </p>
                <button
                  type="button"
                  onClick={handleSpeakEnglish}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full transition-all hover:scale-110"
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
              className="w-full py-4 px-6 fun-button text-white font-bold rounded-2xl transition-all text-lg hover:scale-[1.02]"
            >
              Nästa ord 👉
            </button>
          </div>
        )}

        {/* Manual correction mode */}
        {cardState === 'manual' && (
          <div className="text-center">
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border-2 border-purple-300">
              <div className="text-5xl mb-2">💡</div>
              <p className="text-purple-600 font-black text-xl mb-2">
                Rätt svar är:
              </p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-bold text-purple-700">
                  {word.english}
                </p>
                <button
                  type="button"
                  onClick={handleSpeakEnglish}
                  className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-200 rounded-full transition-all hover:scale-110"
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
            <p className="text-gray-600 font-medium mb-4">
              Kunde du det här ordet?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleManualCorrection(false)}
                className="flex-1 py-4 px-6 danger-button text-white font-bold rounded-2xl transition-all hover:scale-[1.02]"
              >
                Nej 😕
              </button>
              <button
                onClick={() => handleManualCorrection(true)}
                className="flex-1 py-4 px-6 success-button text-white font-bold rounded-2xl transition-all hover:scale-[1.02]"
              >
                Ja! 🎯
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
