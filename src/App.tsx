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
    <div className="min-h-screen animated-gradient">
      {/* Fireworks celebration */}
      {showFireworks && (
        <Fireworks onComplete={() => setShowFireworks(false)} />
      )}

      {/* Decorative floating elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">
          ✨
        </div>
        <div
          className="absolute top-40 right-20 text-3xl animate-float opacity-20"
          style={{ animationDelay: '1s' }}
        >
          📚
        </div>
        <div
          className="absolute bottom-40 left-20 text-3xl animate-float opacity-20"
          style={{ animationDelay: '2s' }}
        >
          🌟
        </div>
        <div
          className="absolute bottom-20 right-10 text-4xl animate-float opacity-20"
          style={{ animationDelay: '0.5s' }}
        >
          🎯
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-black text-white drop-shadow-lg animate-slide-up">
            <span className="inline-block hover:animate-bounce cursor-default">
              🎮
            </span>{' '}
            Glosquiz{' '}
            <span className="inline-block hover:animate-bounce cursor-default">
              🚀
            </span>
          </h1>
        </header>

        {/* Main content */}
        <main>
          {loading && <Loading />}

          {error && (
            <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl max-w-md mx-auto">
              <p className="text-red-500 mb-4 text-lg">😕 {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 fun-button text-white font-bold rounded-full"
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
              <label className="inline-flex items-center gap-2 text-white/90 cursor-pointer bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={readAloud}
                  onChange={(e) => setReadAloud(e.target.checked)}
                  className="w-5 h-5 rounded-full border-2 border-white/50 text-purple-500 focus:ring-purple-400 focus:ring-offset-0"
                />
                <span className="text-sm font-medium">🔊 Läs upp orden</span>
              </label>
            )}
            <div>
              <button
                onClick={() => setShowWordList(true)}
                className="text-sm text-white/90 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all font-medium"
              >
                📖 Visa alla ord
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
