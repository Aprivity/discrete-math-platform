"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SurfaceCard } from "@/components/SurfaceCard";
import { questionCategories, questions } from "@/data/questions";
import { generateExamPaper } from "@/lib/exam-generator";
import { saveExamPaper } from "@/lib/exam-storage";
import type { ExamQuestionTypeCounts } from "@/types/exam";

type ExamBuilderProps = {
  userId: string;
  onPaperCreated: () => void;
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

export function ExamBuilder({ userId, onPaperCreated }: ExamBuilderProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [totalQuestionCount, setTotalQuestionCount] = useState(20);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [questionTypeCounts, setQuestionTypeCounts] = useState<ExamQuestionTypeCounts>({});
  const [warnings, setWarnings] = useState<string[]>([]);

  const scopedQuestionCount = useMemo(() => {
    if (selectedCategories.length === 0) {
      return questions.length;
    }

    return questions.filter((question) => selectedCategories.includes(question.category)).length;
  }, [selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) => (current.includes(category) ? current.filter((item) => item !== category) : [...current, category]));
  };

  const updateTypeCount = (type: keyof ExamQuestionTypeCounts, value: number) => {
    const nextCount = Math.max(0, value);
    setQuestionTypeCounts((current) => ({
      ...current,
      [type]: nextCount,
    }));
  };

  const createPaper = () => {
    const result = generateExamPaper({
      userId,
      selectedCategories,
      questionTypeCounts,
      totalQuestionCount: clampNumber(totalQuestionCount, 1, 200),
      durationMinutes: clampNumber(durationMinutes, 1, 300),
    });

    if (result.paper.questionIds.length === 0) {
      setWarnings(["当前条件下没有可用题目，请调整知识点或题型数量。"]);
      return;
    }

    saveExamPaper(result.paper);
    setWarnings(result.warnings);
    onPaperCreated();
    router.push(`/exam/${result.paper.id}`);
  };

  return (
    <SurfaceCard>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#2f2a24] dark:text-white">自定义组卷</h2>
          <p className="mt-2 text-sm text-[#6f665c] dark:text-slate-400">可先圈定知识点范围，再按总题数或题型数量随机抽题。</p>
        </div>
        <p className="font-mono text-sm text-[#a8844f] dark:text-indigo-300">可抽 {scopedQuestionCount} 题</p>
      </div>

      <div className="mt-8 grid gap-7">
        <div>
          <h3 className="text-sm font-semibold text-[#4b4238] dark:text-slate-200">知识点范围</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {questionCategories.map((category) => {
              const isSelected = selectedCategories.includes(category.label);

              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => toggleCategory(category.label)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isSelected
                      ? "border-[rgba(201,166,107,0.48)] bg-[rgba(255,244,214,0.78)] text-[#2f2a24] shadow-[0_10px_24px_rgba(120,95,60,0.1)] dark:border-indigo-300/60 dark:bg-indigo-400/20 dark:text-white"
                      : "border-[rgba(190,170,140,0.22)] bg-[rgba(255,252,245,0.45)] text-[#6f665c] hover:border-[rgba(201,166,107,0.36)] hover:bg-[rgba(255,244,214,0.56)] dark:border-white/10 dark:bg-slate-950/20 dark:text-slate-300 dark:hover:border-indigo-300/40 dark:hover:bg-indigo-400/10"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-[#4b4238] dark:text-slate-200">总题数</span>
            <input
              type="number"
              min={1}
              max={200}
              value={totalQuestionCount}
              onChange={(event) => setTotalQuestionCount(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-[rgba(190,170,140,0.24)] bg-[rgba(255,252,245,0.5)] px-4 py-3 text-sm text-[#2f2a24] outline-none transition focus:border-[rgba(201,166,107,0.5)] dark:border-white/10 dark:bg-slate-950/30 dark:text-white dark:focus:border-indigo-300/50"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[#4b4238] dark:text-slate-200">考试时长（分钟）</span>
            <input
              type="number"
              min={1}
              max={300}
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-[rgba(190,170,140,0.24)] bg-[rgba(255,252,245,0.5)] px-4 py-3 text-sm text-[#2f2a24] outline-none transition focus:border-[rgba(201,166,107,0.5)] dark:border-white/10 dark:bg-slate-950/30 dark:text-white dark:focus:border-indigo-300/50"
            />
          </label>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#4b4238] dark:text-slate-200">按题型数量组卷（填写后优先按题型抽题）</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {[
              ["judge", "判断题数量"],
              ["single", "单选题数量"],
              ["short", "简答题数量"],
            ].map(([type, label]) => (
              <label key={type} className="block">
                <span className="text-xs text-[#6f665c] dark:text-slate-400">{label}</span>
                <input
                  type="number"
                  min={0}
                  value={questionTypeCounts[type as keyof ExamQuestionTypeCounts] ?? 0}
                  onChange={(event) => updateTypeCount(type as keyof ExamQuestionTypeCounts, Number(event.target.value))}
                  className="mt-2 w-full rounded-lg border border-[rgba(190,170,140,0.24)] bg-[rgba(255,252,245,0.5)] px-4 py-3 text-sm text-[#2f2a24] outline-none transition focus:border-[rgba(201,166,107,0.5)] dark:border-white/10 dark:bg-slate-950/30 dark:text-white dark:focus:border-indigo-300/50"
                />
              </label>
            ))}
          </div>
        </div>

        {warnings.length > 0 ? (
          <div className="rounded-lg border border-[rgba(201,166,107,0.28)] bg-[rgba(255,244,214,0.5)] p-4 text-sm leading-7 text-[#6f665c] dark:border-indigo-300/25 dark:bg-indigo-400/10 dark:text-slate-300">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={createPaper}
          className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-5 py-3 text-sm font-semibold text-[#2f2a24] shadow-[0_16px_34px_rgba(120,95,60,0.18)] transition hover:-translate-y-0.5 md:w-fit dark:bg-none dark:bg-indigo-400 dark:text-slate-950"
        >
          生成试卷并开始考试
        </button>
      </div>
    </SurfaceCard>
  );
}
