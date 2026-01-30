import { useState, useEffect } from 'react';
import { Answer, QuizState } from './types';
import { useVocabulary } from './hooks/useVocabulary';
import { useSpeech } from './hooks/useSpeech';
import { Loading } from './components/Loading';
import { Quiz } from './components/Quiz';
import { Result } from './components/Result';
import { Fireworks } from './components/Fireworks';
import { WordList } from './components/WordList';

function App() {
  const { words, loading, error } = useVocabulary();
  const { speak, supported: speechSupported } = useSpeech();

  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [readAloud, setReadAloud] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showWordList, setShowWordList] = useState(false);

  // Update quiz state based on loading
  useEffect(() => {
    if (!loading && words.length > 0) {
      setQuizState('quiz');
    }
  }, [loading, words]);

  const handleQuizComplete = (quizAnswers: Answer[]) => {
    setAnswers(quizAnswers);
    setQuizState('result');

    // Check if all answers are correct
    const allCorrect = quizAnswers.every((a) => a.correct);
    if (allCorrect) {
      setShowFireworks(true);
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setShowFireworks(false);
    setQuizState('quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Fireworks celebration */}
      {showFireworks && (
        <Fireworks onComplete={() => setShowFireworks(false)} />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pys glosor</h1>
        </header>

        {/* Main content */}
        <main>
          {loading && <Loading />}

          {error && (
            <div className="text-center p-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Försök igen
              </button>
            </div>
          )}

          {quizState === 'quiz' && !loading && !error && (
            <Quiz
              words={words}
              readAloud={readAloud}
              speak={speak}
              onComplete={handleQuizComplete}
            />
          )}

          {quizState === 'result' && (
            <Result answers={answers} onRestart={handleRestart} />
          )}
        </main>

        {/* Footer settings */}
        {quizState === 'quiz' && (
          <footer className="mt-8 text-center space-y-3">
            {speechSupported && (
              <label className="inline-flex items-center gap-2 text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={readAloud}
                  onChange={(e) => setReadAloud(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Läs upp</span>
              </label>
            )}
            <div>
              <button
                onClick={() => setShowWordList(true)}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Visa alla ord
              </button>
            </div>
          </footer>
        )}
      </div>

      {/* Word list modal */}
      {showWordList && (
        <WordList words={words} onClose={() => setShowWordList(false)} speak={speak} />
      )}
    </div>
  );
}

export default App;
