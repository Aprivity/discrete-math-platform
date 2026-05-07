export type StudyAnswerRecord = {
  id: string;
  userId: string;
  questionId: string;
  category: string;
  chapter: string;
  type: "judge" | "single" | "short";
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean | null;
  answeredAt: string;
};

export type UserStudyStats = {
  totalCount: number;
  gradableCount: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  shortAnswerCount: number;
  todayCount: number;
  streakDays: number;
};

export type CategoryStudyStat = {
  name: string;
  totalCount: number;
  gradableCount: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
};
