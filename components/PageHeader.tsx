type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-10 pt-16 text-center sm:px-8 lg:pt-20">
      <p className="mb-4 font-mono text-sm uppercase tracking-[0.28em] text-indigo-300">{eyebrow}</p>
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
    </section>
  );
}
