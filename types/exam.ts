export type ExamMode = "custom";

export type ExamStatus = "in-progress" | "submitted" | "expired";

export type ExamQuestionTypeCounts = {
  judge?: number;
  single?: number;
  short?: number;
};

export type ExamResult = {
  total: number;
  answered: number;
  autoGradable: number;
  correct: number;
  wrong: number;
  accuracy: number;
  usedSeconds: number;
  hasShortQuestions: boolean;
};

export type ExamPaper = {
  id: string;
  userId: string;
  title: string;
  mode: ExamMode;
  selectedCategories: string[];
  questionTypeCounts: ExamQuestionTypeCounts;
  totalQuestionCount: number;
  durationMinutes: number;
  startedAt: string;
  submittedAt?: string;
  deadlineAt: string;
  status: ExamStatus;
  questionIds: string[];
  answers: Record<string, string>;
  result?: ExamResult;
};

export type GenerateExamPaperOptions = {
  userId: string;
  selectedCategories: string[];
  questionTypeCounts: ExamQuestionTypeCounts;
  totalQuestionCount: number;
  durationMinutes: number;
};

export type GenerateExamPaperResult = {
  paper: ExamPaper;
  warnings: string[];
};
