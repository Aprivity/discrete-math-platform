import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";
import { mastery } from "@/data/mock";

const statCards = [
  { label: "总刷题数", value: "128", hint: "mock 数据" },
  { label: "正确率", value: "76%", hint: "近阶段平均" },
  { label: "错题数", value: "31", hint: "待复盘" },
  { label: "连续练习", value: "5 天", hint: "静态展示" },
];

export default function StatsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Learning Stats"
        title="学习统计"
        description="当前使用 mock 数据展示总刷题数、正确率、错题数和章节掌握情况，为后续接入真实学习记录预留版式。"
      />
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <SurfaceCard key={card.label}>
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{card.value}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-indigo-300">{card.hint}</p>
            </SurfaceCard>
          ))}
        </div>

        <SurfaceCard className="mt-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">章节掌握情况</h2>
              <p className="mt-2 text-sm text-slate-400">用静态进度条先呈现统计区域，后续替换为真实章节数据。</p>
            </div>
            <p className="font-mono text-sm text-indigo-300">MOCK OVERVIEW</p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {mastery.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-200">{item.name}</span>
                  <span className="text-slate-400">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-950/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </section>
    </main>
  );
}
