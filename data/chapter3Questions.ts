import rawChapter3Questions from "@/data/chapter3-questions-cleaned.json";
import type { Question, QuestionCategory, QuestionFormula, QuestionOption, QuestionType } from "@/data/questions";
import type { KnowledgePointId } from "@/data/knowledgePoints";

type RawChapter3Option = {
  key: string;
  text: string;
  selected?: boolean;
};

type RawChapter3Question = {
  id: number;
  chapter: string;
  type: "single-choice" | "true-false";
  question: string;
  options?: RawChapter3Option[];
  answer: string;
  explanation: string;
  formulas?: QuestionFormula[];
};

const propositionalIds = new Set([1, 2, 4, 6, 9, 10, 12, 20, 21, 25, 26, 27, 29, 31, 32]);
const predicateIds = new Set([3, 5, 7, 8, 11, 13, 15, 16, 17, 18, 19, 23, 24, 28, 30, 33, 34, 35]);
const quantifierIds = new Set([14, 22]);

const knowledgePointById: Record<KnowledgePointId, { category: QuestionCategory; name: string }> = {
  set: { category: "集合", name: "集合" },
  relation: { category: "关系", name: "关系" },
  "function-mapping": { category: "函数与映射", name: "函数与映射" },
  "propositional-logic": { category: "命题逻辑", name: "命题逻辑" },
  "predicate-logic": { category: "谓词逻辑", name: "谓词逻辑" },
  "quantifier-logic": { category: "量词逻辑", name: "量词逻辑" },
  combinatorics: { category: "组合数学", name: "组合数学" },
  "graph-theory": { category: "图论", name: "图论" },
  tree: { category: "树", name: "树" },
  algebra: { category: "代数结构", name: "代数结构" },
};

function getChapter3KnowledgePoint(questionId: number): KnowledgePointId | null {
  if (propositionalIds.has(questionId)) {
    return "propositional-logic";
  }

  if (predicateIds.has(questionId)) {
    return "predicate-logic";
  }

  if (quantifierIds.has(questionId)) {
    return "quantifier-logic";
  }

  return null;
}

function normalizeQuestionType(type: RawChapter3Question["type"]): QuestionType {
  return type === "true-false" ? "judge" : "single";
}

function normalizeOptions(question: RawChapter3Question): QuestionOption[] {
  if (question.options?.length) {
    return question.options.map((option) => ({
      key: option.key,
      text: option.text,
      selected: option.selected,
    }));
  }

  if (question.type === "true-false") {
    return [
      { key: "1", text: "对" },
      { key: "2", text: "错" },
    ];
  }

  return [];
}

function formatOption(option: QuestionOption) {
  return `${option.key}. ${option.text}`;
}

export function attachKnowledgePoint(question: RawChapter3Question): Question | null {
  const knowledgePointId = getChapter3KnowledgePoint(question.id);

  if (!knowledgePointId) {
    return null;
  }

  const knowledgePoint = knowledgePointById[knowledgePointId];
  const optionItems = normalizeOptions(question);

  return {
    id: `chapter3-${question.id}`,
    sourceQuestionId: question.id,
    category: knowledgePoint.category,
    chapter: question.chapter || "第三章",
    type: normalizeQuestionType(question.type),
    title: question.question,
    options: optionItems.map(formatOption),
    optionItems,
    answer: question.answer ?? "",
    explanation: question.explanation ?? "",
    difficulty: "medium",
    tags: ["第三章", knowledgePoint.name],
    formulas: question.formulas ?? [],
    knowledgePointId,
    knowledgePointName: knowledgePoint.name,
  };
}

export const chapter3QuestionsWithKnowledgePoint: Question[] = (rawChapter3Questions as RawChapter3Question[])
  .map(attachKnowledgePoint)
  .filter((question): question is Question => Boolean(question));
