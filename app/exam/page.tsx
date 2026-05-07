"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";
import { ExamBuilder } from "@/components/exam/exam-builder";
import { ExamHistory } from "@/components/exam/exam-history";
import { getCurrentUser } from "@/lib/auth";
import { expireOverduePaper, getExamPapers } from "@/lib/exam-storage";
import { GUEST_USER_ID } from "@/lib/study-records";
import type { ExamPaper } from "@/types/exam";
import type { PublicUser } from "@/types/user";

function formatDeadline(value: string) {
  return new Date(value).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ExamPage() {
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [papers, setPapers] = useState<ExamPaper[]>([]);
  const [isReady, setIsReady] = useState(false);

  const userId = currentUser?.id ?? GUEST_USER_ID;

  const syncPapers = () => {
    const nextUser = getCurrentUser();
    const nextUserId = nextUser?.id ?? GUEST_USER_ID;

    setCurrentUser(nextUser);
    setPapers(getExamPapers(nextUserId).map((paper) => expireOverduePaper(paper)));
    setIsReady(true);
  };

  useEffect(() => {
    syncPapers();
    window.addEventListener("lisan-auth-change", syncPapers);
    window.addEventListener("lisan-exam-papers-change", syncPapers);
    window.addEventListener("storage", syncPapers);

    return () => {
      window.removeEventListener("lisan-auth-change", syncPapers);
      window.removeEventListener("lisan-exam-papers-change", syncPapers);
      window.removeEventListener("storage", syncPapers);
    };
  }, []);

  const inProgressPapers = useMemo(() => papers.filter((paper) => paper.status === "in-progress"), [papers]);

  return (
    <main>
      <PageHeader
        eyebrow="Mock Exam"
        title="模拟考试"
        description="自定义知识点、题型、数量和考试时间，生成属于你的离散数学模拟卷。"
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 sm:px-8">
        {isReady && !currentUser ? (
          <SurfaceCard>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#a8844f] dark:text-indigo-300">Guest Mode</p>
                <h2 className="mt-3 text-2xl font-semibold text-[#2f2a24] dark:text-white">当前为游客模式</h2>
                <p className="mt-3 text-sm leading-7 text-[#6f665c] dark:text-slate-400">
                  试卷只保存在本机。登录后可长期保存并同步学习记录。
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-5 py-3 text-sm font-semibold text-[#2f2a24] shadow-[0_16px_34px_rgba(120,95,60,0.18)] transition hover:-translate-y-0.5 dark:bg-none dark:bg-indigo-400 dark:text-slate-950"
              >
                去登录
              </Link>
            </div>
          </SurfaceCard>
        ) : null}

        <ExamBuilder userId={userId} onPaperCreated={syncPapers} />

        <SurfaceCard>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#2f2a24] dark:text-white">正在进行的考试</h2>
              <p className="mt-2 text-sm text-[#6f665c] dark:text-slate-400">刷新或重新进入网站后，可以从这里继续未完成试卷。</p>
            </div>
            <p className="font-mono text-sm text-[#a8844f] dark:text-indigo-300">{inProgressPapers.length} ACTIVE</p>
          </div>

          {inProgressPapers.length === 0 ? (
            <div className="mt-8 rounded-lg border border-[rgba(190,170,140,0.18)] bg-[rgba(255,252,245,0.38)] p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
              <h3 className="text-xl font-semibold text-[#2f2a24] dark:text-white">暂无未完成试卷</h3>
              <p className="mt-3 text-sm text-[#6f665c] dark:text-slate-400">生成试卷后，考试会立即保存到本地。</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {inProgressPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="rounded-lg border border-[rgba(190,170,140,0.18)] bg-[rgba(255,252,245,0.42)] p-5 dark:border-white/10 dark:bg-slate-950/20"
                >
                  <h3 className="text-lg font-semibold text-[#2f2a24] dark:text-white">{paper.title}</h3>
                  <p className="mt-2 text-sm text-[#6f665c] dark:text-slate-400">
                    {paper.totalQuestionCount} 题 · {paper.durationMinutes} 分钟 · 截止 {formatDeadline(paper.deadlineAt)}
                  </p>
                  <Link
                    href={`/exam/${paper.id}`}
                    className="mt-5 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-4 py-2.5 text-sm font-semibold text-[#2f2a24] shadow-[0_12px_28px_rgba(120,95,60,0.14)] transition hover:-translate-y-0.5 dark:bg-none dark:bg-indigo-400 dark:text-slate-950"
                  >
                    继续考试
                  </Link>
                </div>
              ))}
            </div>
          )}
        </SurfaceCard>

        {isReady ? (
          <ExamHistory papers={papers} onChange={syncPapers} />
        ) : (
          <SurfaceCard className="p-10 text-center">
            <p className="text-sm text-[#6f665c] dark:text-slate-300">正在读取历史试卷...</p>
          </SurfaceCard>
        )}
      </section>
    </main>
  );
}
