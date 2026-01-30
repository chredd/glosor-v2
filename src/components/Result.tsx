import { Answer } from '../types';

interface ResultProps {
  answers: Answer[];
  onRestart: () => void;
}

export function Result({ answers, onRestart }: ResultProps) {
  const correctCount = answers.filter((a) => a.correct).length;
  const totalCount = answers.length;
  const allCorrect = correctCount === totalCount;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Score summary */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Resultat</h2>
        <p
          className={`text-4xl font-bold ${
            allCorrect ? 'text-green-600' : 'text-blue-600'
          }`}
        >
          {correctCount} av {totalCount} rätt
        </p>
        {allCorrect && (
          <p className="text-xl text-green-600 mt-2">Fantastiskt! Alla rätt!</p>
        )}
      </div>

      {/* Answers list */}
      <div className="space-y-3 mb-8">
        {answers.map((answer, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 ${
              answer.correct
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-sm">Svenska</p>
                <p className="text-gray-800 font-medium truncate">
                  {answer.word.swedish}
                </p>
              </div>
              <div
                className={`text-2xl ${
                  answer.correct ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {answer.correct ? '✓' : '✗'}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-600 text-sm">Rätt svar</p>
                <p className="text-gray-800 font-medium">{answer.word.english}</p>
              </div>
              {answer.userAnswer && (
                <div>
                  <p className="text-gray-600 text-sm">Ditt svar</p>
                  <p
                    className={`font-medium ${
                      answer.correct ? 'text-green-700' : 'text-red-600'
                    }`}
                  >
                    {answer.userAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Restart button */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto py-3 px-8 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Försök igen
        </button>
      </div>
    </div>
  );
}
