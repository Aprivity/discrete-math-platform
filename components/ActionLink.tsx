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
      ? "bg-indigo-400 text-slate-950 shadow-[0_0_32px_rgba(129,140,248,0.35)] hover:bg-indigo-300"
      : "border border-white/15 bg-white/10 text-white hover:bg-white/15";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition ${styles}`}
    >
      {children}
    </Link>
  );
}
