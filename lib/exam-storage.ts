import { questions, type Question } from "@/data/questions";
import { addStudyRecord } from "@/lib/study-records";
import type { ExamPaper, ExamResult, ExamStatus } from "@/types/exam";
import type { StudyAnswerRecord } from "@/types/study";

export const EXAM_PAPERS_STORAGE_KEY = "lisan_exam_papers";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isRecordMap(value: unknown): value is Record<string, string> {
  return Boolean(value) && typeof value === "object" && Object.values(value as Record<string, unknown>).every((item) => typeof item === "string");
}

function isExamPaper(value: unknown): value is ExamPaper {
  if (!value || typeof value !== "object") {
    return false;
  }

  const paper = value as Partial<ExamPaper>;

  return (
    typeof paper.id === "string" &&
    typeof paper.userId === "string" &&
    typeof paper.title === "string" &&
    paper.mode === "custom" &&
    Array.isArray(paper.selectedCategories) &&
    typeof paper.questionTypeCounts === "object" &&
    typeof paper.totalQuestionCount === "number" &&
    typeof paper.durationMinutes === "number" &&
    typeof paper.startedAt === "string" &&
    typeof paper.deadlineAt === "string" &&
    (paper.status === "in-progress" || paper.status === "submitted" || paper.status === "expired") &&
    Array.isArray(paper.questionIds) &&
    paper.questionIds.every((questionId) => typeof questionId === "string") &&
    isRecordMap(paper.answers)
  );
}

function readExamPapers(): ExamPaper[] {
  if (!canUseStorage()) {
    return [];
  }

  const rawPapers = window.localStorage.getItem(EXAM_PAPERS_STORAGE_KEY);

  if (!rawPapers) {
    return [];
  }

  try {
    const parsedPapers = JSON.parse(rawPapers);
    return Array.isArray(parsedPapers) ? parsedPapers.filter(isExamPaper) : [];
  } catch {
    return [];
  }
}

function saveExamPapers(papers: ExamPaper[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(EXAM_PAPERS_STORAGE_KEY, JSON.stringify(papers));
  window.dispatchEvent(new Event("lisan-exam-papers-change"));
}

function createRecordId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getExamPapers(userId?: string) {
  const papers = readExamPapers();
  const filteredPapers = userId ? papers.filter((paper) => paper.userId === userId) : papers;

  return filteredPapers.sort((left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime());
}

export function getExamPaper(paperId: string) {
  return readExamPapers().find((paper) => paper.id === paperId) ?? null;
}

export function saveExamPaper(paper: ExamPaper) {
  const papers = readExamPapers();
  const nextPapers = papers.some((candidate) => candidate.id === paper.id)
    ? papers.map((candidate) => (candidate.id === paper.id ? paper : candidate))
    : [...papers, paper];

  saveExamPapers(nextPapers);
}

export function deleteExamPaper(paperId: string) {
  saveExamPapers(readExamPapers().filter((paper) => paper.id !== paperId));
}

export function saveExamAnswer(paperId: string, questionId: string, answer: string) {
  const paper = getExamPaper(paperId);

  if (!paper || paper.status !== "in-progress") {
    return null;
  }

  const nextPaper: ExamPaper = {
    ...paper,
    answers: {
      ...paper.answers,
      [questionId]: answer,
    },
  };

  saveExamPaper(nextPaper);
  return nextPaper;
}

export function getPaperQuestions(paper: ExamPaper) {
  const questionById = new Map(questions.map((question) => [question.id, question]));
  return paper.questionIds.map((questionId) => questionById.get(questionId)).filter((question): question is Question => Boolean(question));
}

export function calculateExamResult(paper: ExamPaper, submittedAt: string): ExamResult {
  const paperQuestions = getPaperQuestions(paper);
  const answered = paperQuestions.filter((question) => Boolean(paper.answers[question.id]?.trim())).length;
  const autoGradableQuestions = paperQuestions.filter((question) => question.type !== "short" && question.answer.trim());
  const correct = autoGradableQuestions.filter((question) => paper.answers[question.id] === question.answer).length;
  const wrong = autoGradableQuestions.length - correct;
  const usedSeconds = Math.max(0, Math.round((new Date(submittedAt).getTime() - new Date(paper.startedAt).getTime()) / 1000));

  return {
    total: paperQuestions.length,
    answered,
    autoGradable: autoGradableQuestions.length,
    correct,
    wrong,
    accuracy: autoGradableQuestions.length > 0 ? Math.round((correct / autoGradableQuestions.length) * 100) : 0,
    usedSeconds,
    hasShortQuestions: paperQuestions.some((question) => question.type === "short"),
  };
}

function savePaperAnswersToStudyRecords(paper: ExamPaper, submittedAt: string) {
  getPaperQuestions(paper).forEach((question) => {
    const userAnswer = paper.answers[question.id] ?? "";
    const record: StudyAnswerRecord = {
      id: createRecordId(),
      userId: paper.userId,
      questionId: question.id,
      category: question.category,
      chapter: question.chapter,
      type: question.type,
      userAnswer,
      correctAnswer: question.answer,
      isCorrect: question.type === "short" || !question.answer.trim() ? null : userAnswer === question.answer,
      answeredAt: submittedAt,
    };

    addStudyRecord(record);
  });
}

export function submitExamPaper(paperId: string, status: Extract<ExamStatus, "submitted" | "expired">) {
  const paper = getExamPaper(paperId);

  if (!paper) {
    return null;
  }

  if (paper.status !== "in-progress") {
    return paper;
  }

  const submittedAt = new Date().toISOString();
  const submittedPaper: ExamPaper = {
    ...paper,
    status,
    submittedAt,
    result: calculateExamResult(paper, submittedAt),
  };

  saveExamPaper(submittedPaper);
  savePaperAnswersToStudyRecords(submittedPaper, submittedAt);
  return submittedPaper;
}

export function expireOverduePaper(paper: ExamPaper) {
  if (paper.status !== "in-progress" || new Date(paper.deadlineAt).getTime() > Date.now()) {
    return paper;
  }

  return submitExamPaper(paper.id, "expired") ?? paper;
}
