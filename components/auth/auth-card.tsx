import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl items-center justify-center px-5 py-16 sm:px-8">
      <section className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-6 block w-fit text-center">
          <span className="block text-sm font-semibold tracking-wide text-[#3b332b] dark:text-white">Aprivity Lisan</span>
          <span className="block text-xs text-[#9a8f82] dark:text-slate-400">离散数学刷题平台</span>
        </Link>

        <div className="rounded-lg border border-[rgba(190,170,140,0.22)] bg-[rgba(255,252,245,0.72)] p-7 shadow-[0_24px_70px_rgba(120,95,60,0.13)] backdrop-blur-[18px] dark:border-white/10 dark:bg-white/[0.08] dark:shadow-[0_0_60px_rgba(129,140,248,0.12)]">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#a8844f] dark:text-indigo-300">Account</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#2f2a24] dark:text-white">{title}</h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6f665c] dark:text-slate-300">{description}</p>
          </div>

          <div className="mt-7">{children}</div>

          {footer ? <div className="mt-6 border-t border-[rgba(190,170,140,0.18)] pt-5 text-center text-sm text-[#6f665c] dark:border-white/10 dark:text-slate-400">{footer}</div> : null}
        </div>

        <Link
          href="/"
          className="mx-auto mt-5 block w-fit text-sm font-semibold text-[#8b6f47] transition hover:text-[#2f2a24] dark:text-indigo-200 dark:hover:text-white"
        >
          返回首页
        </Link>
      </section>
    </main>
  );
}
