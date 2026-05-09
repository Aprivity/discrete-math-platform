export type KnowledgePointId =
  | "set"
  | "relation"
  | "function-mapping"
  | "propositional-logic"
  | "predicate-logic"
  | "quantifier-logic"
  | "combinatorics"
  | "graph-theory"
  | "tree"
  | "algebra";

export type KnowledgePoint = {
  id: KnowledgePointId;
  name: string;
  categorySlug: string;
};

export const knowledgePoints: KnowledgePoint[] = [
  { id: "set", name: "集合", categorySlug: "set" },
  { id: "relation", name: "关系", categorySlug: "relation" },
  { id: "function-mapping", name: "函数与映射", categorySlug: "function" },
  { id: "propositional-logic", name: "命题逻辑", categorySlug: "logic" },
  { id: "predicate-logic", name: "谓词逻辑", categorySlug: "predicate" },
  { id: "quantifier-logic", name: "量词逻辑", categorySlug: "quantifier" },
  { id: "combinatorics", name: "组合数学", categorySlug: "combinatorics" },
  { id: "graph-theory", name: "图论", categorySlug: "graph" },
  { id: "tree", name: "树", categorySlug: "tree" },
  { id: "algebra", name: "代数结构", categorySlug: "algebra" },
];

export function getKnowledgePointByCategorySlug(slug: string) {
  return knowledgePoints.find((point) => point.categorySlug === slug);
}

export function getKnowledgePointByName(name: string) {
  return knowledgePoints.find((point) => point.name === name);
}
