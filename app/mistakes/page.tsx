"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";
import { questions } from "@/data/questions";
import { getCurrentUser } from "@/lib/auth";
import { GUEST_USER_ID, getStudyRecords } from "@/lib/study-records";
import type { StudyAnswerRecord } from "@/types/study";
import type { PublicUser } from "@/types/user";

export default function MistakesPage() {
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [records, setRecords] = useState<StudyAnswerRecord[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncMistakes = () => {
      const nextUser = getCurrentUser();
      const nextUserId = nextUser?.id ?? GUEST_USER_ID;

      setCurrentUser(nextUser);
      setRecords(getStudyRecords(nextUserId).filter((record) => record.isCorrect === false));
      setIsReady(true);
    };

    syncMistakes();
    window.addEventListener("lisan-auth-change", syncMistakes);
    window.addEventListener("lisan-study-records-change", syncMistakes);
    window.addEventListener("storage", syncMistakes);

    return () => {
      window.removeEventListener("lisan-auth-change", syncMistakes);
      window.removeEventListener("lisan-study-records-change", syncMistakes);
      window.removeEventListener("storage", syncMistakes);
    };
  }, []);

  const mistakeItems = useMemo(() => {
    const questionById = new Map(questions.map((question) => [question.id, question]));

    return records
      .map((record) => ({ record, question: questionById.get(record.questionId) }))
      .sort((left, right) => new Date(right.record.answeredAt).getTime() - new Date(left.record.answeredAt).getTime());
  }, [records]);

  return (
    <main>
      <PageHeader
        eyebrow="Mistake Book"
        title="错题本"
        description="自动汇总练习和模拟考试中答错的判断题、单选题，方便按章节复盘。"
      />
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        {isReady && !currentUser ? (
          <SurfaceCard className="mb-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#a8844f] dark:text-indigo-300">Guest Mode</p>
                <h2 className="mt-3 text-2xl font-semibold text-[#2f2a24] dark:text-white">当前展示本机 guest 错题</h2>
                <p className="mt-3 text-sm leading-7 text-[#6f665c] dark:text-slate-400">登录后可以把错题和学习统计归到自己的账号记录里。</p>
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

        {!isReady ? (
          <SurfaceCard className="p-10 text-center">
            <p className="text-sm text-[#6f665c] dark:text-slate-300">正在读取错题记录...</p>
          </SurfaceCard>
        ) : mistakeItems.length === 0 ? (
          <SurfaceCard className="p-10 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg border border-[rgba(201,166,107,0.32)] bg-[rgba(255,244,214,0.56)] font-mono text-[#8b6f47] shadow-[0_14px_34px_rgba(120,95,60,0.1)] dark:border-indigo-300/30 dark:bg-indigo-300/10 dark:text-indigo-200">
              0
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-[#2f2a24] dark:text-white">暂无错题</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6f665c] dark:text-slate-400">
              开始章节练习或模拟考试后，答错的客观题会汇总到这里。
            </p>
          </SurfaceCard>
        ) : (
          <div className="grid gap-5">
            {mistakeItems.map(({ record, question }) => (
              <article
                key={record.id}
                className="rounded-lg border border-rose-300/40 bg-rose-100/35 p-6 shadow-[0_18px_50px_rgba(120,95,60,0.1)] backdrop-blur-[18px] dark:border-rose-300/25 dark:bg-rose-400/10"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-white/45 px-3 py-1 text-rose-800 dark:bg-white/10 dark:text-rose-200">{record.category}</span>
                  <span className="rounded-full bg-white/45 px-3 py-1 text-rose-800 dark:bg-white/10 dark:text-rose-200">{record.chapter}</span>
                  <span className="rounded-full bg-white/45 px-3 py-1 text-rose-800 dark:bg-white/10 dark:text-rose-200">
                    {new Date(record.answeredAt).toLocaleString("zh-CN")}
                  </span>
                </div>
                <h2 className="mt-5 whitespace-pre-wrap text-xl font-semibold leading-8 text-[#2f2a24] dark:text-white">
                  {question?.title ?? "题目内容暂不可用"}
                </h2>
                <div className="mt-5 grid gap-2 text-sm leading-7 text-[#4b4238] dark:text-slate-200">
                  <p>你的答案：{record.userAnswer || "未作答"}</p>
                  <p>正确答案：{record.correctAnswer}</p>
                  <p>解析：{question?.explanation.trim() || "解析待补充"}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
