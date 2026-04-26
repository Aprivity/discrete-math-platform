type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-10 pt-16 text-center sm:px-8 lg:pt-20">
      <p className="mb-4 font-mono text-sm uppercase tracking-[0.28em] text-[#a8844f] dark:text-indigo-300">{eyebrow}</p>
      <h1 className="bg-gradient-to-br from-[#2f2a24] via-[#6b5f50] to-[#8b6f47] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl dark:from-white dark:via-slate-100 dark:to-indigo-200">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6f665c] sm:text-lg dark:text-slate-300">{description}</p>
    </section>
  );
}
