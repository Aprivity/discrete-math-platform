import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/practice", label: "章节练习" },
  { href: "/exam", label: "模拟考试" },
  { href: "/mistakes", label: "错题本" },
  { href: "/stats", label: "学习统计" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060817]/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-indigo-300/30 bg-white/10 shadow-[0_0_28px_rgba(129,140,248,0.28)]">
            <Image
              src="/avatar.jpg"
              alt="Aprivity avatar"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-wide text-white">Aprivity Lisan</span>
            <span className="block text-xs text-slate-400">Discrete Math Practice</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://aprivity.xyz"
            className="rounded-lg border border-indigo-300/30 bg-indigo-400/10 px-3 py-2 text-indigo-100 transition hover:border-indigo-200/60 hover:bg-indigo-400/20"
          >
            返回主站
          </a>
        </div>
      </nav>
    </header>
  );
}
