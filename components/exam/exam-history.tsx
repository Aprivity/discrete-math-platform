"use client";

import Link from "next/link";
import { SurfaceCard } from "@/components/SurfaceCard";
import { deleteExamPaper } from "@/lib/exam-storage";
import type { ExamPaper } from "@/types/exam";

type ExamHistoryProps = {
  papers: ExamPaper[];
  onChange: () => void;
};

const statusLabels: Record<ExamPaper["status"], string> = {
  "in-progress": "进行中",
  submitted: "已提交",
  expired: "已超时",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatUsedSeconds(seconds?: number) {
  if (!seconds) {
    return "暂无";
  }

  return `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`;
}

export function ExamHistory({ papers, onChange }: ExamHistoryProps) {
  const removePaper = (paperId: string) => {
    if (!window.confirm("确定删除这份试卷吗？")) {
      return;
    }

    deleteExamPaper(paperId);
    onChange();
  };

  return (
    <SurfaceCard>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#2f2a24] dark:text-white">历史试卷</h2>
          <p className="mt-2 text-sm text-[#6f665c] dark:text-slate-400">未完成试卷可以继续作答，已提交或超时试卷可以查看结果。</p>
        </div>
        <p className="font-mono text-sm text-[#a8844f] dark:text-indigo-300">{papers.length} PAPERS</p>
      </div>

      {papers.length === 0 ? (
        <div className="mt-8 rounded-lg border border-[rgba(190,170,140,0.18)] bg-[rgba(255,252,245,0.38)] p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
          <h3 className="text-xl font-semibold text-[#2f2a24] dark:text-white">还没有试卷</h3>
          <p className="mt-3 text-sm text-[#6f665c] dark:text-slate-400">生成一份模拟卷后，它会保存在这里。</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="rounded-lg border border-[rgba(190,170,140,0.18)] bg-[rgba(255,252,245,0.42)] p-5 dark:border-white/10 dark:bg-slate-950/20"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#2f2a24] dark:text-white">{paper.title}</h3>
                    <span className="rounded-full bg-[rgba(255,244,214,0.64)] px-3 py-1 text-xs text-[#6f665c] dark:bg-indigo-300/15 dark:text-slate-300">
                      {statusLabels[paper.status]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#6f665c] dark:text-slate-400">
                    {formatDate(paper.startedAt)} · {paper.totalQuestionCount} 题 · {paper.durationMinutes} 分钟
                  </p>
                  <p className="mt-2 text-sm text-[#9a8f82] dark:text-slate-500">
                    正确率 {paper.result ? `${paper.result.accuracy}%` : "暂无"} · 用时 {formatUsedSeconds(paper.result?.usedSeconds)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/exam/${paper.id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-4 py-2.5 text-sm font-semibold text-[#2f2a24] shadow-[0_12px_28px_rgba(120,95,60,0.14)] transition hover:-translate-y-0.5 dark:bg-none dark:bg-indigo-400 dark:text-slate-950"
                  >
                    {paper.status === "in-progress" ? "继续考试" : "查看结果"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removePaper(paper.id)}
                    className="rounded-lg border border-rose-300/30 bg-rose-100/35 px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:-translate-y-0.5 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-200"
                  >
                    删除试卷
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
