import type { ReactNode } from "react";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className = "" }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-indigo-950/20 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
