import { Word } from '../types';

interface WordListProps {
  words: Word[];
  onClose: () => void;
  speak: (text: string, lang: 'sv' | 'en') => void;
}

export function WordList({ words, onClose, speak }: WordListProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-purple-100">
          <h2 className="text-xl font-black gradient-text flex items-center gap-2">
            <span>📖</span> Veckans ord
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all hover:rotate-90"
            aria-label="Stäng"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Word list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {words.map((word, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-4 p-3 rounded-xl hover:bg-purple-50 transition-all group"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-50 w-6">{index + 1}.</span>
                  <span className="font-medium text-gray-800">{word.swedish}</span>
                </div>
                <button
                  onClick={() => speak(word.english, 'en')}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-800 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 transition-all group-hover:scale-105"
                >
                  <span className="font-medium">{word.english}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-100 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-bold text-sm">
            <span>✨</span>
            {words.length} ord att lära sig
            <span>✨</span>
          </span>
        </div>
      </div>
    </div>
  );
}
