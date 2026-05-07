"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SurfaceCard } from "@/components/SurfaceCard";
import { ExamResult } from "@/components/exam/exam-result";
import { ExamTimer } from "@/components/exam/exam-timer";
import { expireOverduePaper, getExamPaper, getPaperQuestions, saveExamAnswer, submitExamPaper } from "@/lib/exam-storage";
import type { ExamPaper } from "@/types/exam";

type ExamPaperViewProps = {
  paperId: string;
};

const questionTypeLabels: Record<string, string> = {
  judge: "判断题",
  single: "单选题",
  short: "简答题",
};

export function ExamPaperView({ paperId }: ExamPaperViewProps) {
  const [paper, setPaper] = useState<ExamPaper | null>(null);
  const [isReady, setIsReady] = useState(false);

  const syncPaper = useCallback(() => {
    const storedPaper = getExamPaper(paperId);
    setPaper(storedPaper ? expireOverduePaper(storedPaper) : null);
    setIsReady(true);
  }, [paperId]);

  useEffect(() => {
    syncPaper();
    window.addEventListener("lisan-exam-papers-change", syncPaper);
    window.addEventListener("storage", syncPaper);

    return () => {
      window.removeEventListener("lisan-exam-papers-change", syncPaper);
      window.removeEventListener("storage", syncPaper);
    };
  }, [syncPaper]);

  const paperQuestions = useMemo(() => (paper ? getPaperQuestions(paper) : []), [paper]);

  const updateAnswer = (questionId: string, answer: string) => {
    const nextPaper = saveExamAnswer(paperId, questionId, answer);

    if (nextPaper) {
      setPaper(nextPaper);
    }
  };

  const finishPaper = useCallback(
    (isExpired: boolean) => {
      const nextPaper = submitExamPaper(paperId, isExpired ? "expired" : "submitted");

      if (nextPaper) {
        setPaper(nextPaper);
      }
    },
    [paperId],
  );

  const submitByUser = () => {
    if (!window.confirm("确定提交试卷吗？提交后将不能继续修改答案。")) {
      return;
    }

    finishPaper(false);
  };

  if (!isReady) {
    return (
      <SurfaceCard className="p-10 text-center">
        <p className="text-sm text-[#6f665c] dark:text-slate-300">正在读取试卷...</p>
      </SurfaceCard>
    );
  }

  if (!paper) {
    return (
      <SurfaceCard className="p-10 text-center">
        <h2 className="text-2xl font-semibold text-[#2f2a24] dark:text-white">没有找到这份试卷</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6f665c] dark:text-slate-400">它可能已被删除，或者不在当前浏览器本地记录中。</p>
        <Link
          href="/exam"
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-5 py-3 text-sm font-semibold text-[#2f2a24] shadow-[0_16px_34px_rgba(120,95,60,0.18)] transition hover:-translate-y-0.5 dark:bg-none dark:bg-indigo-400 dark:text-slate-950"
        >
          返回模拟考试
        </Link>
      </SurfaceCard>
    );
  }

  if (paper.status !== "in-progress") {
    return <ExamResult paper={paper} />;
  }

  const answeredCount = paperQuestions.filter((question) => Boolean(paper.answers[question.id]?.trim())).length;

  return (
    <div className="grid gap-6">
      <SurfaceCard className="sticky top-24 z-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#a8844f] dark:text-indigo-300">IN PROGRESS</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2f2a24] dark:text-white">{paper.title}</h2>
            <p className="mt-2 text-sm text-[#6f665c] dark:text-slate-400">
              已作答 {answeredCount} / {paperQuestions.length} · 倒计时不会因刷新页面重置
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ExamTimer deadlineAt={paper.deadlineAt} onExpire={() => finishPaper(true)} />
            <button
              type="button"
              onClick={submitByUser}
              className="rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-5 py-3 text-sm font-semibold text-[#2f2a24] shadow-[0_16px_34px_rgba(120,95,60,0.18)] transition hover:-translate-y-0.5 dark:bg-none dark:bg-indigo-400 dark:text-slate-950"
            >
              提交试卷
            </button>
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-5">
        {paperQuestions.map((question, index) => {
          const selectedAnswer = paper.answers[question.id] ?? "";
          const isShortQuestion = question.type === "short";

          return (
            <article
              key={question.id}
              className="rounded-lg border border-[rgba(190,170,140,0.22)] bg-[rgba(255,252,245,0.7)] p-6 shadow-[0_18px_50px_rgba(120,95,60,0.1)] backdrop-blur-[18px] dark:border-white/10 dark:bg-white/[0.07] dark:shadow-2xl dark:shadow-indigo-950/20"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-[rgba(190,170,140,0.24)] bg-[rgba(255,252,245,0.46)] px-3 py-1 font-mono text-[#8b6f47] dark:border-white/10 dark:bg-white/10 dark:text-indigo-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-[rgba(255,244,214,0.58)] px-3 py-1 text-[#6f665c] dark:bg-indigo-300/15 dark:text-slate-300">
                  {questionTypeLabels[question.type]}
                </span>
                <span className="rounded-full bg-[rgba(255,244,214,0.58)] px-3 py-1 text-[#6f665c] dark:bg-indigo-300/15 dark:text-slate-300">
                  {question.category}
                </span>
              </div>

              <h3 className="mt-5 whitespace-pre-wrap text-xl font-semibold leading-8 text-[#2f2a24] dark:text-white">{question.title}</h3>

              {isShortQuestion ? (
                <textarea
                  value={selectedAnswer}
                  onChange={(event) => updateAnswer(question.id, event.target.value)}
                  placeholder="写下你的解答思路..."
                  rows={5}
                  className="mt-5 min-h-32 w-full resize-y rounded-lg border border-[rgba(190,170,140,0.24)] bg-[rgba(255,252,245,0.5)] px-4 py-3 text-sm leading-7 text-[#2f2a24] outline-none transition placeholder:text-[#9a8f82] focus:border-[rgba(201,166,107,0.5)] dark:border-white/10 dark:bg-slate-950/30 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-300/50"
                />
              ) : (
                <div className="mt-5 grid gap-3">
                  {(question.options ?? []).map((option) => {
                    const value = question.type === "single" ? option.slice(0, 1) : option;
                    const isSelected = selectedAnswer === value;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateAnswer(question.id, value)}
                        className={`rounded-lg border px-4 py-3 text-left text-sm leading-6 transition ${
                          isSelected
                            ? "border-[rgba(201,166,107,0.5)] bg-[rgba(255,244,214,0.74)] text-[#2f2a24] shadow-[0_12px_28px_rgba(120,95,60,0.12)] dark:border-indigo-300/60 dark:bg-indigo-400/20 dark:text-white"
                            : "border-[rgba(190,170,140,0.2)] bg-[rgba(255,252,245,0.42)] text-[#4b4238] hover:border-[rgba(201,166,107,0.36)] hover:bg-[rgba(255,244,214,0.56)] dark:border-white/10 dark:bg-slate-950/25 dark:text-slate-300 dark:hover:border-indigo-300/40 dark:hover:bg-indigo-400/10"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
