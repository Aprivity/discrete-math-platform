"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/practice", label: "章节练习" },
  { href: "/exam", label: "模拟考试" },
  { href: "/mistakes", label: "错题本" },
  { href: "/stats", label: "学习统计" },
];

export function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(190,170,140,0.24)] bg-[rgba(255,252,245,0.72)] shadow-[0_18px_44px_rgba(120,95,60,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#060817]/75 dark:shadow-none">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-[rgba(190,170,140,0.32)] bg-[rgba(255,252,245,0.62)] shadow-[0_12px_30px_rgba(120,95,60,0.14)] dark:border-indigo-300/30 dark:bg-white/10 dark:shadow-[0_0_28px_rgba(129,140,248,0.28)]">
            <Image
              src="/avatar.jpg"
              alt="Aprivity avatar"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-wide text-[#3b332b] dark:text-white">Aprivity Lisan</span>
            <span className="block text-xs text-[#9a8f82] dark:text-slate-400">Discrete Math Practice</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm text-[#6f665c] dark:text-slate-300">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 transition ${
                  isActive
                    ? "bg-gradient-to-r from-[#ead2a6] to-[#f7e6c8] text-[#2f2a24] shadow-[0_10px_28px_rgba(201,166,107,0.18)] dark:from-indigo-300/25 dark:to-fuchsia-300/20 dark:text-white"
                    : "hover:bg-[rgba(255,244,214,0.6)] hover:text-[#2f2a24] dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href="https://aprivity.xyz"
            className="rounded-lg border border-[rgba(190,170,140,0.28)] bg-[rgba(255,252,245,0.56)] px-3 py-2 text-[#4b4238] transition hover:-translate-y-0.5 hover:border-[rgba(201,166,107,0.42)] hover:bg-[rgba(255,244,214,0.72)] hover:shadow-[0_12px_28px_rgba(120,95,60,0.12)] dark:border-indigo-300/30 dark:bg-indigo-400/10 dark:text-indigo-100 dark:hover:border-indigo-200/60 dark:hover:bg-indigo-400/20"
          >
            查看作者
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "切换到白天模式" : "切换到深色模式"}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[rgba(190,170,140,0.28)] bg-[rgba(255,252,245,0.56)] text-[#6f665c] transition hover:-translate-y-0.5 hover:border-[rgba(201,166,107,0.42)] hover:text-[#2f2a24] hover:shadow-[0_12px_28px_rgba(120,95,60,0.12)] dark:border-white/15 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15 dark:hover:text-white"
          >
            {theme === "dark" ? "☾" : "☼"}
          </button>
        </div>
      </nav>
    </header>
  );
}
