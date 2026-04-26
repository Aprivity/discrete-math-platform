import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";
import { getKnowledgeChapterBySlug, knowledgeChapters } from "@/data/knowledge";
import { getQuestionCategoryBySlug } from "@/data/questions";

type KnowledgePageProps = {
  params: Promise<{
    chapter: string;
  }>;
};

export function generateStaticParams() {
  return knowledgeChapters.map((chapter) => ({
    chapter: chapter.slug,
  }));
}

export default async function KnowledgePage({ params }: KnowledgePageProps) {
  const { chapter } = await params;
  const category = getQuestionCategoryBySlug(chapter);
  const knowledge = category ? getKnowledgeChapterBySlug(category.slug) : undefined;

  if (!category || !knowledge) {
    notFound();
  }

  return (
    <main>
      <PageHeader eyebrow="Knowledge" title={knowledge.title} description={knowledge.description} />
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/practice"
            className="rounded-lg border border-[rgba(190,170,140,0.28)] bg-[rgba(255,252,245,0.58)] px-4 py-2 text-sm font-semibold text-[#4b4238] transition hover:-translate-y-0.5 hover:border-[rgba(201,166,107,0.42)] hover:bg-[rgba(255,244,214,0.72)] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            返回章节
          </Link>
          <Link
            href={category.practiceHref}
            className="rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-4 py-2 text-sm font-semibold text-[#2f2a24] shadow-[0_12px_28px_rgba(120,95,60,0.14)] transition hover:-translate-y-0.5 dark:from-indigo-400 dark:to-fuchsia-300 dark:text-slate-950"
          >
            进入练习
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {knowledge.points.map((point) => (
            <SurfaceCard key={point.id}>
              <h2 className="text-xl font-semibold text-[#2f2a24] dark:text-white">{point.name}</h2>
              <p className="mt-4 text-sm leading-7 text-[#6f665c] dark:text-slate-400">{point.explanation}</p>

              <div className="mt-5 grid gap-3 text-sm leading-6">
                <KnowledgeList title="定义" items={point.definitions} />
                <KnowledgeList title="重要公式" items={point.formulas} mono />
                <KnowledgeList title="典型例子" items={point.examples} />
                <div className="rounded-lg border border-[rgba(190,170,140,0.18)] bg-[rgba(255,252,245,0.44)] p-4 dark:border-white/10 dark:bg-slate-950/25">
                  <p className="font-semibold text-[#4b4238] dark:text-slate-200">常见考法</p>
                  <p className="mt-1 text-[#6f665c] dark:text-slate-400">{point.examFocus}</p>
                </div>
                <KnowledgeList title="复习提示" items={point.tips} />
                <div className="rounded-lg border border-[rgba(201,166,107,0.22)] bg-[rgba(255,244,214,0.46)] p-4 dark:border-indigo-300/20 dark:bg-indigo-400/10">
                  <p className="font-semibold text-[#4b4238] dark:text-slate-200">易错提醒</p>
                  <p className="mt-1 text-[#6f665c] dark:text-slate-400">{point.pitfall}</p>
                  {point.mistakes?.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[#6f665c] dark:text-slate-400">
                      {point.mistakes.map((mistake) => (
                        <li key={mistake}>{mistake}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </section>
    </main>
  );
}

function KnowledgeList({
  title,
  items,
  mono = false,
}: {
  title: string;
  items?: string[];
  mono?: boolean;
}) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[rgba(190,170,140,0.18)] bg-[rgba(255,252,245,0.44)] p-4 dark:border-white/10 dark:bg-slate-950/25">
      <p className="font-semibold text-[#4b4238] dark:text-slate-200">{title}</p>
      <ul className={`mt-2 list-disc space-y-1 pl-5 text-[#6f665c] dark:text-slate-400 ${mono ? "font-mono text-xs" : ""}`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
