"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";
import { CategoryProgress } from "@/components/stats/category-progress";
import { StatCard } from "@/components/stats/stat-card";
import { questionCategories } from "@/data/questions";
import { getCurrentUser } from "@/lib/auth";
import { GUEST_USER_ID, getCategoryStats, getUserStudyStats } from "@/lib/study-records";
import type { CategoryStudyStat, UserStudyStats } from "@/types/study";
import type { PublicUser } from "@/types/user";

const emptyStats: UserStudyStats = {
  totalCount: 0,
  gradableCount: 0,
  correctCount: 0,
  wrongCount: 0,
  accuracy: 0,
  shortAnswerCount: 0,
  todayCount: 0,
  streakDays: 0,
};

export default function StatsPage() {
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [stats, setStats] = useState<UserStudyStats>(emptyStats);
  const [categoryStats, setCategoryStats] = useState<CategoryStudyStat[]>([]);

  useEffect(() => {
    const syncStats = () => {
      const nextUser = getCurrentUser();
      const nextUserId = nextUser?.id ?? GUEST_USER_ID;

      setCurrentUser(nextUser);
      setStats(getUserStudyStats(nextUserId));
      setCategoryStats(getCategoryStats(nextUserId));
      setIsReady(true);
    };

    syncStats();
    window.addEventListener("lisan-auth-change", syncStats);
    window.addEventListener("lisan-study-records-change", syncStats);
    window.addEventListener("storage", syncStats);

    return () => {
      window.removeEventListener("lisan-auth-change", syncStats);
      window.removeEventListener("lisan-study-records-change", syncStats);
      window.removeEventListener("storage", syncStats);
    };
  }, []);

  const allCategoryStats = useMemo(() => {
    const existingStats = new Map(categoryStats.map((item) => [item.name, item]));

    return questionCategories.map<CategoryStudyStat>((category) => {
      const existing = existingStats.get(category.label);

      return (
        existing ?? {
          name: category.label,
          totalCount: 0,
          gradableCount: 0,
          correctCount: 0,
          wrongCount: 0,
          accuracy: 0,
        }
      );
    });
  }, [categoryStats]);

  const hasRecords = isReady && stats.totalCount > 0;
  const statCards = [
    { label: "总刷题数", value: String(stats.totalCount), hint: `今日 ${stats.todayCount} 题` },
    { label: "正确率", value: `${stats.accuracy}%`, hint: `已判分 ${stats.gradableCount} 题` },
    { label: "错题数", value: String(stats.wrongCount), hint: "需要复盘" },
    { label: "连续学习", value: `${stats.streakDays} 天`, hint: `简答 ${stats.shortAnswerCount} 题` },
  ];

  return (
    <main>
      <PageHeader
        eyebrow="Learning Stats"
        title="学习统计"
        description="记录每次提交答案后的真实学习数据，统计刷题数量、正确率、错题数和章节掌握情况。"
      />
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        {isReady && !currentUser ? (
          <SurfaceCard className="mb-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#a8844f] dark:text-indigo-300">Guest Mode</p>
                <h2 className="mt-3 text-2xl font-semibold text-[#2f2a24] dark:text-white">登录后可以长期保存你的学习统计</h2>
                <p className="mt-3 text-sm leading-7 text-[#6f665c] dark:text-slate-400">
                  当前展示的是本机 guest 学习记录。换浏览器或清理缓存后，本地记录可能不会保留。
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-5 py-3 text-sm font-semibold text-[#2f2a24] shadow-[0_16px_34px_rgba(120,95,60,0.18)] transition hover:-translate-y-0.5 dark:bg-none dark:bg-indigo-400 dark:text-slate-950"
                >
                  去登录
                </Link>
                <Link
                  href="/practice"
                  className="inline-flex items-center justify-center rounded-lg border border-[rgba(190,170,140,0.28)] bg-[rgba(255,252,245,0.58)] px-5 py-3 text-sm font-semibold text-[#4b4238] transition hover:-translate-y-0.5 hover:border-[rgba(201,166,107,0.42)] hover:bg-[rgba(255,244,214,0.72)] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  继续练习
                </Link>
              </div>
            </div>
          </SurfaceCard>
        ) : null}

        {!isReady ? (
          <SurfaceCard className="p-10 text-center">
            <p className="text-sm text-[#6f665c] dark:text-slate-300">正在读取学习记录...</p>
          </SurfaceCard>
        ) : !hasRecords ? (
          <SurfaceCard className="p-10 text-center">
            <h2 className="text-2xl font-semibold text-[#2f2a24] dark:text-white">还没有学习记录</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6f665c] dark:text-slate-400">
              完成几道练习后，这里会自动生成你的学习统计。
            </p>
            <Link
              href="/practice"
              className="mt-7 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-5 py-3 text-sm font-semibold text-[#2f2a24] shadow-[0_16px_34px_rgba(120,95,60,0.18)] transition hover:-translate-y-0.5 dark:bg-none dark:bg-indigo-400 dark:text-slate-950"
            >
              去章节练习
            </Link>
          </SurfaceCard>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card) => (
                <StatCard key={card.label} label={card.label} value={card.value} hint={card.hint} />
              ))}
            </div>

            <SurfaceCard className="mt-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-[#2f2a24] dark:text-white">章节掌握情况</h2>
                  <p className="mt-2 text-sm text-[#6f665c] dark:text-slate-400">
                    按章节统计自动判分题目的正确率，简答题会计入练习数量但不影响正确率。
                  </p>
                </div>
                <p className="font-mono text-sm text-[#a8844f] dark:text-indigo-300">LOCAL RECORDS</p>
              </div>

              <CategoryProgress items={allCategoryStats} />
            </SurfaceCard>
          </>
        )}
      </section>
    </main>
  );
}
