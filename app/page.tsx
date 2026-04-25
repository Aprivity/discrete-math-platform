import { ActionLink } from "@/components/ActionLink";
import { SurfaceCard } from "@/components/SurfaceCard";

const portals = [
  { href: "/practice", title: "章节练习", description: "按知识点逐章推进，适合课后巩固和期末前查漏补缺。" },
  { href: "/exam", title: "模拟考试", description: "预留随机组卷、限时练习和自动评分入口，后续接入真实题库。" },
  { href: "/mistakes", title: "错题本", description: "未来集中沉淀错题、解析和重练记录，让薄弱点更清楚。" },
  { href: "/stats", title: "学习统计", description: "用数据追踪刷题量、正确率和章节掌握情况。" },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
        <div>
          <h1 className="apple-title max-w-4xl text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
            离散数学刷题平台
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-300">
            面向期末复习的高效率练习空间。先从静态章节、模拟考试入口、错题本和学习统计开始，后续逐步接入题库、评分与个人记录。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ActionLink href="/practice">开始练习</ActionLink>
            <ActionLink href="/exam" variant="secondary">
              进入模拟考试
            </ActionLink>
          </div>
        </div>

        <SurfaceCard className="relative overflow-hidden p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          <p className="font-mono text-sm text-indigo-200">CURRENT MODULES</p>
          <div className="mt-8 grid gap-4">
            {portals.map((portal) => (
              <a
                key={portal.href}
                href={portal.href}
                className="group rounded-lg border border-white/10 bg-slate-950/35 p-5 transition hover:border-indigo-300/50 hover:bg-indigo-400/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-white">{portal.title}</h2>
                  <span className="font-mono text-sm text-indigo-300 transition group-hover:translate-x-1">→</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{portal.description}</p>
              </a>
            ))}
          </div>
        </SurfaceCard>
      </section>
    </main>
  );
}
