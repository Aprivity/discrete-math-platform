import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";

export default function MistakesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Mistake Book"
        title="错题本"
        description="错题本会在后续记录错题、答案解析、所属章节和重练状态。当前版本先保留清晰的空状态与内容区域。"
      />
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <SurfaceCard className="p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg border border-indigo-300/30 bg-indigo-300/10 font-mono text-indigo-200">
            0
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-white">暂无错题</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
            开始章节练习或模拟考试后，答错的题目会汇总到这里，方便按章节复盘与二次练习。
          </p>
        </SurfaceCard>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <SurfaceCard>
            <h3 className="text-lg font-semibold text-white">错题列表区域</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">后续展示题干、错误答案、正确答案、解析和知识点标签。</p>
          </SurfaceCard>
          <SurfaceCard>
            <h3 className="text-lg font-semibold text-white">复习计划区域</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">后续可按错题次数、章节和最近练习时间生成复习建议。</p>
          </SurfaceCard>
        </div>
      </section>
    </main>
  );
}
