import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { QuestionPractice } from "@/components/QuestionPractice";
import { getQuestionCategoryBySlug, getQuestionsByCategory, questionCategories } from "@/data/questions";

type PracticeChapterPageProps = {
  params: Promise<{
    chapter: string;
  }>;
};

export function generateStaticParams() {
  return questionCategories.map((category) => ({
    chapter: category.slug,
  }));
}

export default async function PracticeChapterPage({ params }: PracticeChapterPageProps) {
  const { chapter } = await params;
  const category = getQuestionCategoryBySlug(chapter);

  if (!category) {
    notFound();
  }

  const questions = getQuestionsByCategory(category.label);
  const judgeCount = questions.filter((question) => question.type === "judge").length;
  const singleCount = questions.filter((question) => question.type === "single").length;

  return (
    <main>
      <PageHeader
        eyebrow="Question Bank"
        title={`${category.label}练习`}
        description={`${category.description} 共 ${questions.length} 题，其中判断题 ${judgeCount} 题，单选题 ${singleCount} 题。`}
      />
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/practice"
            className="rounded-lg border border-[rgba(190,170,140,0.28)] bg-[rgba(255,252,245,0.58)] px-4 py-2 text-sm font-semibold text-[#4b4238] transition hover:-translate-y-0.5 hover:border-[rgba(201,166,107,0.42)] hover:bg-[rgba(255,244,214,0.72)] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            返回章节
          </Link>
          <div className="flex flex-wrap gap-2 text-xs text-[#6f665c] dark:text-slate-300">
            <span className="rounded-full bg-[rgba(255,244,214,0.58)] px-3 py-1 dark:bg-indigo-300/15">判断题 {judgeCount}</span>
            <span className="rounded-full bg-[rgba(255,244,214,0.58)] px-3 py-1 dark:bg-indigo-300/15">单选题 {singleCount}</span>
          </div>
        </div>
        <QuestionPractice questions={questions} />
      </section>
    </main>
  );
}
