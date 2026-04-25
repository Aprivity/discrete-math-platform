import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";
import { chapters } from "@/data/mock";

export default function PracticePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Practice"
        title="章节练习"
        description="按离散数学核心章节组织练习入口。当前版本展示静态章节卡片，后续可接入题目列表、难度筛选和练习进度。"
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 sm:px-8 md:grid-cols-2 xl:grid-cols-3">
        {chapters.map((chapter, index) => (
          <SurfaceCard key={chapter.title} className="group transition hover:-translate-y-1 hover:border-indigo-300/40">
            <div className="flex items-start justify-between gap-5">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-indigo-300/15 font-mono text-sm text-indigo-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                掌握度 {chapter.progress}%
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-white">{chapter.title}</h2>
            <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{chapter.description}</p>
            <div className="mt-6 h-2 rounded-full bg-slate-950/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-indigo-300"
                style={{ width: `${chapter.progress}%` }}
              />
            </div>
            <button className="mt-6 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition group-hover:border-indigo-300/50 group-hover:bg-indigo-400/20">
              进入练习
            </button>
          </SurfaceCard>
        ))}
      </section>
    </main>
  );
}
