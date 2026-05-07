import { PageHeader } from "@/components/PageHeader";
import { ExamPaperView } from "@/components/exam/exam-paper-view";

type ExamPaperPageProps = {
  params: Promise<{
    paperId: string;
  }>;
};

export default async function ExamPaperPage({ params }: ExamPaperPageProps) {
  const { paperId } = await params;

  return (
    <main>
      <PageHeader
        eyebrow="Mock Exam"
        title="模拟考试"
        description="继续未完成试卷，或查看已提交试卷的成绩、答案和解析。"
      />
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <ExamPaperView paperId={paperId} />
      </section>
    </main>
  );
}
