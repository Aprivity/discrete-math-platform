import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";
import { getQuestionsByCategorySlug, questionCategories } from "@/data/questions";

export default function PracticePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Practice"
        title="章节练习"
        description="按题库大类进入练习。当前已接入集合、关系、函数与映射、逻辑、组合数学、图论、树与代数结构题目，支持判断题、单选题和简答题作答。"
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 sm:px-8 md:grid-cols-2 xl:grid-cols-3">
        {questionCategories.map((category, index) => {
          const questionCount = getQuestionsByCategorySlug(category.slug).length;

          return (
            <SurfaceCard key={category.slug} className="group hover:-translate-y-1 dark:hover:border-indigo-300/40">
              <div className="flex items-start justify-between gap-5">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-[rgba(255,244,214,0.68)] font-mono text-sm text-[#8b6f47] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:bg-indigo-300/15 dark:text-indigo-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-[rgba(190,170,140,0.24)] bg-[rgba(255,252,245,0.44)] px-3 py-1 text-xs text-[#6f665c] dark:border-white/10 dark:bg-transparent dark:text-slate-300">
                  {questionCount} 题
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-[#2f2a24] dark:text-white">{category.label}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-[#6f665c] dark:text-slate-400">{category.description}</p>
              <div className="mt-6 grid gap-3 min-[360px]:grid-cols-2">
                <Link
                  href={category.knowledgeHref}
                  className="inline-flex items-center justify-center rounded-lg border border-[rgba(190,170,140,0.24)] bg-[rgba(255,252,245,0.54)] px-4 py-3 text-sm font-semibold text-[#6f665c] transition hover:-translate-y-0.5 hover:border-[rgba(201,166,107,0.42)] hover:bg-[rgba(255,244,214,0.7)] hover:text-[#2f2a24] hover:shadow-[0_12px_28px_rgba(120,95,60,0.1)] dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-indigo-300/50 dark:hover:bg-white/15 dark:hover:text-white"
                >
                  知识点
                </Link>
                <Link
                  href={category.practiceHref}
                  className="inline-flex items-center justify-center rounded-lg border border-[rgba(201,166,107,0.32)] bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-4 py-3 text-sm font-semibold text-[#2f2a24] shadow-[0_14px_34px_rgba(120,95,60,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(120,95,60,0.18)] dark:border-indigo-300/30 dark:from-indigo-400 dark:to-fuchsia-300 dark:text-slate-950 dark:shadow-[0_0_30px_rgba(129,140,248,0.22)]"
                >
                  进入练习
                </Link>
              </div>
            </SurfaceCard>
          );
        })}
      </section>
    </main>
  );
}
