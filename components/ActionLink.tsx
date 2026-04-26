import Link from "next/link";
import type { ReactNode } from "react";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ActionLink({ href, children, variant = "primary" }: ActionLinkProps) {
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] text-[#2f2a24] shadow-[0_16px_34px_rgba(120,95,60,0.18)] hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(120,95,60,0.22)] dark:bg-none dark:bg-indigo-400 dark:text-slate-950 dark:shadow-[0_0_32px_rgba(129,140,248,0.35)] dark:hover:bg-indigo-300"
      : "border border-[rgba(190,170,140,0.28)] bg-[rgba(255,252,245,0.58)] text-[#4b4238] hover:-translate-y-0.5 hover:border-[rgba(201,166,107,0.42)] hover:bg-[rgba(255,244,214,0.72)] hover:shadow-[0_14px_32px_rgba(120,95,60,0.12)] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition ${styles}`}
    >
      {children}
    </Link>
  );
}
