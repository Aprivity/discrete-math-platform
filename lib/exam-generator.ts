import { questionCategories, questions, type Question } from "@/data/questions";
import type { ExamQuestionTypeCounts, GenerateExamPaperOptions, GenerateExamPaperResult } from "@/types/exam";

const questionTypes: Array<keyof ExamQuestionTypeCounts> = ["judge", "single", "short"];

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function normalizeCategoryInput(selectedCategories: string[]) {
  return new Set(
    selectedCategories.flatMap((category) => {
      const matchedCategory = questionCategories.find(
        (candidate) => candidate.label === category || candidate.slug === category || candidate.aliases.includes(category),
      );

      return matchedCategory ? [matchedCategory.label, matchedCategory.slug, ...matchedCategory.aliases] : [category];
    }),
  );
}

function hasRequestedTypeCounts(questionTypeCounts: ExamQuestionTypeCounts) {
  return questionTypes.some((type) => (questionTypeCounts[type] ?? 0) > 0);
}

function pickByType(sourceQuestions: Question[], questionTypeCounts: ExamQuestionTypeCounts) {
  const pickedQuestionIds = new Set<string>();
  const pickedQuestions: Question[] = [];
  const warnings: string[] = [];

  questionTypes.forEach((type) => {
    const requestedCount = Math.max(0, questionTypeCounts[type] ?? 0);

    if (requestedCount === 0) {
      return;
    }

    const candidates = shuffle(sourceQuestions.filter((question) => question.type === type && !pickedQuestionIds.has(question.id)));
    const selectedQuestions = candidates.slice(0, requestedCount);

    selectedQuestions.forEach((question) => pickedQuestionIds.add(question.id));
    pickedQuestions.push(...selectedQuestions);

    if (selectedQuestions.length < requestedCount) {
      warnings.push(`${type} 题数量不足，已抽取 ${selectedQuestions.length} 道。`);
    }
  });

  return { pickedQuestions, warnings };
}

export function generateExamPaper(options: GenerateExamPaperOptions): GenerateExamPaperResult {
  const selectedCategorySet = normalizeCategoryInput(options.selectedCategories);
  const scopedQuestions =
    selectedCategorySet.size > 0
      ? questions.filter((question) => {
          const category = questionCategories.find((candidate) => candidate.label === question.category);
          return (
            selectedCategorySet.has(question.category) ||
            selectedCategorySet.has(question.knowledgePointId ?? "") ||
            selectedCategorySet.has(category?.slug ?? "") ||
            category?.aliases.some((alias) => selectedCategorySet.has(alias))
          );
        })
      : questions;

  const warnings: string[] = [];
  const requestedByType = hasRequestedTypeCounts(options.questionTypeCounts);
  const pickedQuestions = requestedByType
    ? pickByType(scopedQuestions, options.questionTypeCounts)
    : { pickedQuestions: shuffle(scopedQuestions).slice(0, options.totalQuestionCount), warnings: [] };

  warnings.push(...pickedQuestions.warnings);

  if (!requestedByType && pickedQuestions.pickedQuestions.length < options.totalQuestionCount) {
    warnings.push(`题库数量不足，已抽取 ${pickedQuestions.pickedQuestions.length} 道。`);
  }

  const startedAt = new Date();
  const durationMinutes = Math.min(300, Math.max(1, options.durationMinutes));
  const questionIds = shuffle(pickedQuestions.pickedQuestions).map((question) => question.id);

  return {
    warnings,
    paper: {
      id: createId(),
      userId: options.userId,
      title: `自定义模拟卷 ${startedAt.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}`,
      mode: "custom",
      selectedCategories: options.selectedCategories,
      questionTypeCounts: options.questionTypeCounts,
      totalQuestionCount: questionIds.length,
      durationMinutes,
      startedAt: startedAt.toISOString(),
      deadlineAt: new Date(startedAt.getTime() + durationMinutes * 60 * 1000).toISOString(),
      status: "in-progress",
      questionIds,
      answers: {},
    },
  };
}
