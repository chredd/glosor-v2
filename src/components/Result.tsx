import { Answer } from '../types';

interface ResultProps {
  answers: Answer[];
  onRestart: () => void;
}

export function Result({ answers, onRestart }: ResultProps) {
  const correctCount = answers.filter((a) => a.correct).length;
  const totalCount = answers.length;
  const allCorrect = correctCount === totalCount;
  const percentage = Math.round((correctCount / totalCount) * 100);

  // Get encouraging message based on score
  const getMessage = () => {
    if (percentage === 100) return { emoji: '🏆', text: 'PERFEKT!' };
    if (percentage >= 80) return { emoji: '🌟', text: 'Fantastiskt bra jobbat!' };
    if (percentage >= 60) return { emoji: '💪', text: 'Bra kämpat! Fortsätt så!' };
    if (percentage >= 40) return { emoji: '📚', text: 'Övning ger färdighet!' };
    return { emoji: '🎯', text: 'Försök igen, du klarar det!' };
  };

  const message = getMessage();

  // Get stars based on percentage
  const getStars = () => {
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  const stars = getStars();

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Score summary card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6 text-center">
        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`text-4xl transition-all ${
                i <= stars
                  ? 'animate-bounce-in'
                  : 'opacity-20 grayscale'
              }`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Emoji and message */}
        <div className="text-6xl mb-4">{message.emoji}</div>
        <h2 className="text-2xl font-black gradient-text mb-2">{message.text}</h2>

        {/* Score display */}
        <div className="relative inline-block my-6">
          <div
            className={`text-7xl font-black ${
              allCorrect
                ? 'animate-rainbow'
                : percentage >= 70
                ? 'text-green-500'
                : percentage >= 50
                ? 'text-yellow-500'
                : 'text-orange-500'
            }`}
          >
            {correctCount}/{totalCount}
          </div>
          <div className="text-gray-500 font-medium mt-1">
            {percentage}% rätt
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-6 max-w-xs mx-auto">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              percentage >= 80
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : percentage >= 60
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                : 'bg-gradient-to-r from-orange-400 to-red-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {allCorrect && (
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-full text-yellow-800 font-bold text-sm mb-4">
            🎉 ALLA RÄTT! 🎉
          </div>
        )}
      </div>

      {/* Answers list */}
      <div className="space-y-3 mb-8">
        {answers.map((answer, index) => (
          <div
            key={index}
            className={`rounded-2xl p-4 backdrop-blur-sm transition-all hover:scale-[1.01] ${
              answer.correct
                ? 'bg-gradient-to-r from-green-100/90 to-emerald-100/90 border-2 border-green-300'
                : 'bg-gradient-to-r from-orange-100/90 to-red-100/90 border-2 border-orange-300'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🇸🇪</span>
                  <p className="text-gray-600 truncate">
                    {answer.word.swedish}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇬🇧</span>
                  <p className="text-gray-800 font-bold truncate">{answer.word.english}</p>
                </div>
              </div>
              <div
                className={`text-3xl ${
                  answer.correct ? 'animate-bounce-in' : ''
                }`}
              >
                {answer.correct ? '✅' : '❌'}
              </div>
            </div>

            {!answer.correct && answer.userAnswer && (
              <div className="mt-2 pt-2 border-t border-orange-200">
                <p className="text-sm text-gray-500">
                  Du skrev:{' '}
                  <span className="text-orange-600 font-medium line-through">
                    {answer.userAnswer}
                  </span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Restart button */}
      <div className="text-center pb-8">
        <button
          onClick={onRestart}
          className="py-4 px-12 fun-button text-white font-black rounded-full text-xl transition-all hover:scale-105"
        >
          🔄 Kör igen!
        </button>
      </div>
    </div>
  );
}
