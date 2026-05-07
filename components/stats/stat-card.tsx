import { SurfaceCard } from "@/components/SurfaceCard";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <SurfaceCard>
      <p className="text-sm text-[#6f665c] dark:text-slate-400">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-[#2f2a24] dark:text-white">{value}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#a8844f] dark:text-indigo-300">{hint}</p>
    </SurfaceCard>
  );
}
