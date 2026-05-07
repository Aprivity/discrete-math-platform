import type { CategoryStudyStat, StudyAnswerRecord, UserStudyStats } from "@/types/study";

export const STUDY_RECORDS_STORAGE_KEY = "lisan_study_records";
export const GUEST_USER_ID = "guest";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isStudyAnswerRecord(value: unknown): value is StudyAnswerRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<StudyAnswerRecord>;

  return (
    typeof record.id === "string" &&
    typeof record.userId === "string" &&
    typeof record.questionId === "string" &&
    typeof record.category === "string" &&
    typeof record.chapter === "string" &&
    (record.type === "judge" || record.type === "single" || record.type === "short") &&
    typeof record.userAnswer === "string" &&
    typeof record.correctAnswer === "string" &&
    (typeof record.isCorrect === "boolean" || record.isCorrect === null) &&
    typeof record.answeredAt === "string"
  );
}

function readStudyRecords(): StudyAnswerRecord[] {
  if (!canUseStorage()) {
    return [];
  }

  const rawRecords = window.localStorage.getItem(STUDY_RECORDS_STORAGE_KEY);

  if (!rawRecords) {
    return [];
  }

  try {
    const parsedRecords = JSON.parse(rawRecords);
    return Array.isArray(parsedRecords) ? parsedRecords.filter(isStudyAnswerRecord) : [];
  } catch {
    return [];
  }
}

function saveStudyRecords(records: StudyAnswerRecord[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STUDY_RECORDS_STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event("lisan-study-records-change"));
}

function toLocalDateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getPreviousDate(date: Date) {
  const previousDate = new Date(date);
  previousDate.setDate(previousDate.getDate() - 1);
  return previousDate;
}

export function getStudyRecords(userId?: string): StudyAnswerRecord[] {
  const records = readStudyRecords();

  if (!userId) {
    return records;
  }

  return records.filter((record) => record.userId === userId);
}

export function addStudyRecord(record: StudyAnswerRecord) {
  saveStudyRecords([...readStudyRecords(), record]);
}

export function getTodayStudyCount(userId: string) {
  const todayKey = toLocalDateKey(new Date());
  return getStudyRecords(userId).filter((record) => toLocalDateKey(record.answeredAt) === todayKey).length;
}

export function getStreakDays(userId: string) {
  const studyDateKeys = new Set(
    getStudyRecords(userId)
      .map((record) => toLocalDateKey(record.answeredAt))
      .filter(Boolean),
  );
  let streakDays = 0;
  let currentDate = new Date();

  while (studyDateKeys.has(toLocalDateKey(currentDate))) {
    streakDays += 1;
    currentDate = getPreviousDate(currentDate);
  }

  return streakDays;
}

export function getUserStudyStats(userId: string): UserStudyStats {
  const records = getStudyRecords(userId);
  const gradableRecords = records.filter((record) => record.isCorrect !== null);
  const correctCount = gradableRecords.filter((record) => record.isCorrect).length;

  return {
    totalCount: records.length,
    gradableCount: gradableRecords.length,
    correctCount,
    wrongCount: records.filter((record) => record.isCorrect === false).length,
    accuracy: gradableRecords.length > 0 ? Math.round((correctCount / gradableRecords.length) * 100) : 0,
    shortAnswerCount: records.filter((record) => record.type === "short").length,
    todayCount: getTodayStudyCount(userId),
    streakDays: getStreakDays(userId),
  };
}

export function getCategoryStats(userId: string): CategoryStudyStat[] {
  const groupedRecords = new Map<string, StudyAnswerRecord[]>();

  getStudyRecords(userId).forEach((record) => {
    const groupName = record.category || record.chapter || "未分类";
    groupedRecords.set(groupName, [...(groupedRecords.get(groupName) ?? []), record]);
  });

  return Array.from(groupedRecords.entries()).map(([name, records]) => {
    const gradableRecords = records.filter((record) => record.isCorrect !== null);
    const correctCount = gradableRecords.filter((record) => record.isCorrect).length;

    return {
      name,
      totalCount: records.length,
      gradableCount: gradableRecords.length,
      correctCount,
      wrongCount: records.filter((record) => record.isCorrect === false).length,
      accuracy: gradableRecords.length > 0 ? Math.round((correctCount / gradableRecords.length) * 100) : 0,
    };
  });
}

export function clearUserStudyRecords(userId: string) {
  saveStudyRecords(readStudyRecords().filter((record) => record.userId !== userId));
}
