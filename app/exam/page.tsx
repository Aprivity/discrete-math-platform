import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";

const features = [
  {
    title: "随机组卷",
    description: "未来将从各章节题库中按比例抽题，生成更接近期末复习节奏的综合练习卷。",
  },
  {
    title: "限时练习",
    description: "预留倒计时与交卷流程，帮助同学提前适应真实考试的时间压力。",
  },
  {
    title: "自动评分",
    description: "客观题自动判分，后续结合解析与知识点标签给出复盘建议。",
  },
];

export default function ExamPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Mock Exam"
        title="模拟考试"
        description="这里先搭好模拟考试入口与功能说明。等题库准备好后，可以继续接入组卷策略、计时器、提交记录和评分逻辑。"
      />
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {features.map((feature) => (
            <SurfaceCard key={feature.title}>
              <p className="font-mono text-sm text-[#a8844f] dark:text-indigo-300">FEATURE</p>
              <h2 className="mt-5 text-2xl font-semibold text-[#2f2a24] dark:text-white">{feature.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#6f665c] dark:text-slate-400">{feature.description}</p>
            </SurfaceCard>
          ))}
        </div>

        <SurfaceCard className="mt-6 flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#2f2a24] dark:text-white">期末综合模拟卷</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f665c] dark:text-slate-400">
              当前为静态占位状态。真实功能上线后，这里会显示考试时长、题量、章节覆盖范围和开始考试按钮。
            </p>
          </div>
          <button className="rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-5 py-3 text-sm font-semibold text-[#2f2a24] opacity-80 shadow-[0_14px_30px_rgba(120,95,60,0.14)] dark:bg-none dark:bg-indigo-300 dark:text-slate-950">
            即将开放
          </button>
        </SurfaceCard>
      </section>
    </main>
  );
}
