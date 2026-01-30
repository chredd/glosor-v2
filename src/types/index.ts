export interface Word {
  english: string;
  swedish: string;
}

export interface Answer {
  word: Word;
  userAnswer: string;
  correct: boolean;
  manualCorrection: boolean;
}

export type QuizState = 'loading' | 'quiz' | 'result';
