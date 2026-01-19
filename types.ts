
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  questions: Question[];
}

export interface ExamResult {
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
}

export type View = 'home' | 'exam-list' | 'exam-session' | 'result';
