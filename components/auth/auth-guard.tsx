"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import type { PublicUser } from "@/types/user";
import { SurfaceCard } from "@/components/SurfaceCard";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(getCurrentUser());
      setIsReady(true);
    };

    syncUser();
    window.addEventListener("lisan-auth-change", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("lisan-auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  if (!isReady) {
    return (
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <SurfaceCard className="p-10 text-center">
          <p className="text-sm text-[#6f665c] dark:text-slate-300">正在读取登录状态...</p>
        </SurfaceCard>
      </section>
    );
  }

  if (!currentUser) {
    return (
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <SurfaceCard className="p-10 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#a8844f] dark:text-indigo-300">Login Required</p>
          <h2 className="mt-4 text-2xl font-semibold text-[#2f2a24] dark:text-white">登录后可以保存错题和学习统计</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6f665c] dark:text-slate-400">
            当前功能会和账号状态关联。第一版先用本地 mock 登录保存状态，后续可以接入真实认证服务和数据库。
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
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
              返回章节练习
            </Link>
          </div>
        </SurfaceCard>
      </section>
    );
  }

  return children;
}
