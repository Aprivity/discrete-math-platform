import type { ReactNode } from "react";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className = "" }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-lg border border-[rgba(190,170,140,0.22)] bg-[rgba(255,252,245,0.7)] p-6 shadow-[0_18px_50px_rgba(120,95,60,0.1)] backdrop-blur-[18px] transition hover:border-[rgba(201,166,107,0.36)] hover:shadow-[0_22px_58px_rgba(120,95,60,0.13)] dark:border-white/10 dark:bg-white/[0.07] dark:shadow-2xl dark:shadow-indigo-950/20 dark:backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
