"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import type { PublicUser } from "@/types/user";

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  return (
    <main>
      <PageHeader eyebrow="Profile" title="个人中心" description="查看本地账号信息，后续会接入真实练习进度、错题记录和学习统计。" />
      <AuthGuard>
        <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <SurfaceCard className="p-8">
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#a8844f] dark:text-indigo-300">Account</p>
              <h2 className="mt-5 text-3xl font-semibold text-[#2f2a24] dark:text-white">{currentUser?.username ?? "已登录用户"}</h2>
              <p className="mt-2 text-sm text-[#6f665c] dark:text-slate-400">{currentUser?.email}</p>
              <div className="mt-6 rounded-lg border border-[rgba(190,170,140,0.18)] bg-[rgba(255,252,245,0.44)] p-4 text-sm leading-7 text-[#6f665c] dark:border-white/10 dark:bg-slate-950/25 dark:text-slate-400">
                当前登录系统是本地 mock 版本，仅用于前端演示。正式上线后应接入 Supabase Auth、NextAuth、Clerk 或自建后端认证系统，并且不要在 localStorage 保存明文密码。
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-7 rounded-lg border border-[rgba(190,170,140,0.28)] bg-[rgba(255,252,245,0.58)] px-5 py-3 text-sm font-semibold text-[#4b4238] transition hover:-translate-y-0.5 hover:border-[rgba(201,166,107,0.42)] hover:bg-[rgba(255,244,214,0.72)] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                退出登录
              </button>
            </SurfaceCard>

            <div className="grid gap-5">
              <SurfaceCard>
                <p className="text-sm text-[#6f665c] dark:text-slate-400">已完成题目数</p>
                <p className="mt-4 text-4xl font-semibold text-[#2f2a24] dark:text-white">0</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#a8844f] dark:text-indigo-300">mock placeholder</p>
              </SurfaceCard>
              <SurfaceCard>
                <p className="text-sm text-[#6f665c] dark:text-slate-400">正确率</p>
                <p className="mt-4 text-4xl font-semibold text-[#2f2a24] dark:text-white">--</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#a8844f] dark:text-indigo-300">等待真实记录接入</p>
              </SurfaceCard>
            </div>
          </div>
        </section>
      </AuthGuard>
    </main>
  );
}
