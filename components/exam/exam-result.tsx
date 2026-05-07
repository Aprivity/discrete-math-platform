"use client";

import Link from "next/link";
import { SurfaceCard } from "@/components/SurfaceCard";
import { getPaperQuestions } from "@/lib/exam-storage";
import type { ExamPaper } from "@/types/exam";

type ExamResultProps = {
  paper: ExamPaper;
};

function formatSeconds(seconds: number) {
  return `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`;
}

export function ExamResult({ paper }: ExamResultProps) {
  const paperQuestions = getPaperQuestions(paper);

  return (
    <div className="grid gap-6">
      <SurfaceCard>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#a8844f] dark:text-indigo-300">
              {paper.status === "expired" ? "EXPIRED" : "SUBMITTED"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#2f2a24] dark:text-white">{paper.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f665c] dark:text-slate-400">
              {paper.status === "expired" ? "试卷已超时自动提交。" : "试卷已提交。"}简答题暂不自动计分，会在下方显示为待自评。
            </p>
          </div>
          <Link
            href="/exam"
            className="inline-flex items-center justify-center rounded-lg border border-[rgba(190,170,140,0.28)] bg-[rgba(255,252,245,0.58)] px-5 py-3 text-sm font-semibold text-[#4b4238] transition hover:-translate-y-0.5 hover:border-[rgba(201,166,107,0.42)] hover:bg-[rgba(255,244,214,0.72)] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            返回模拟考试
          </Link>
        </div>

        {paper.result ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["总题数", `${paper.result.total}`],
              ["已作答", `${paper.result.answered}`],
              ["正确率", `${paper.result.accuracy}%`],
              ["用时", formatSeconds(paper.result.usedSeconds)],
              ["自动判分", `${paper.result.autoGradable}`],
              ["正确题", `${paper.result.correct}`],
              ["错误题", `${paper.result.wrong}`],
              ["简答题", paper.result.hasShortQuestions ? "待自评" : "无"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-[rgba(255,244,214,0.48)] p-4 dark:bg-indigo-300/10">
                <p className="text-xs text-[#9a8f82] dark:text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#2f2a24] dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </SurfaceCard>

      <div className="grid gap-5">
        {paperQuestions.map((question, index) => {
          const userAnswer = paper.answers[question.id] ?? "";
          const isShort = question.type === "short";
          const isCorrect = !isShort && userAnswer === question.answer;
          const hasAnswer = Boolean(userAnswer.trim());

          return (
            <article
              key={question.id}
              className={`rounded-lg border p-6 shadow-[0_18px_50px_rgba(120,95,60,0.1)] backdrop-blur-[18px] ${
                isShort
                  ? "border-[rgba(201,166,107,0.28)] bg-[rgba(255,244,214,0.42)] dark:border-indigo-300/25 dark:bg-indigo-400/10"
                  : isCorrect
                    ? "border-emerald-300/40 bg-emerald-100/40 dark:border-emerald-300/25 dark:bg-emerald-400/10"
                    : "border-rose-300/40 bg-rose-100/40 dark:border-rose-300/25 dark:bg-rose-400/10"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-white/45 px-3 py-1 font-mono text-[#8b6f47] dark:bg-white/10 dark:text-indigo-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-white/45 px-3 py-1 text-[#6f665c] dark:bg-white/10 dark:text-slate-300">{question.category}</span>
                <span className="rounded-full bg-white/45 px-3 py-1 text-[#6f665c] dark:bg-white/10 dark:text-slate-300">
                  {isShort ? "待自评" : isCorrect ? "正确" : "错误"}
                </span>
              </div>
              <h3 className="mt-5 whitespace-pre-wrap text-xl font-semibold leading-8 text-[#2f2a24] dark:text-white">{question.title}</h3>
              <div className="mt-5 grid gap-2 text-sm leading-7 text-[#4b4238] dark:text-slate-200">
                <p>你的答案：{hasAnswer ? userAnswer : "未作答"}</p>
                <p>正确答案：{question.answer}</p>
                <p>解析：{question.explanation.trim() || "解析待补充"}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
