import type { CategoryStudyStat } from "@/types/study";

type CategoryProgressProps = {
  items: CategoryStudyStat[];
};

export function CategoryProgress({ items }: CategoryProgressProps) {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.name}>
          <div className="mb-2 flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-[#4b4238] dark:text-slate-200">{item.name}</span>
            <span className="shrink-0 text-[#9a8f82] dark:text-slate-400">
              {item.gradableCount > 0 ? `${item.accuracy}%` : "暂无记录"}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[rgba(190,170,140,0.18)] dark:bg-slate-950/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#c9a66b] via-[#e8cfa3] to-[#d7beff] dark:from-cyan-300 dark:via-indigo-300 dark:to-fuchsia-300"
              style={{ width: `${item.accuracy}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#9a8f82] dark:text-slate-500">
            已练 {item.totalCount} 题，自动判分 {item.gradableCount} 题
          </p>
        </div>
      ))}
    </div>
  );
}
