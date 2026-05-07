"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { isValidEmail, loginUser } from "@/lib/auth";

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  const validate = () => {
    const nextErrors: LoginErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = "请输入邮箱。";
    } else if (!isValidEmail(normalizedEmail)) {
      nextErrors.email = "邮箱格式不正确。";
    }

    if (!password) {
      nextErrors.password = "请输入密码。";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const result = loginUser({ email, password });

    if (!result.ok) {
      setErrors({ form: result.message });
      return;
    }

    router.push("/practice");
  };

  return (
    <AuthCard
      title="欢迎回来"
      description="继续你的离散数学练习"
      footer={
        <>
          还没有账号？{" "}
          <Link href="/register" className="font-semibold text-[#8b6f47] hover:text-[#2f2a24] dark:text-indigo-200 dark:hover:text-white">
            去注册
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        {errors.form ? (
          <div className="rounded-lg border border-rose-300/35 bg-rose-100/45 px-4 py-3 text-sm leading-6 text-rose-800 dark:border-rose-300/25 dark:bg-rose-400/10 dark:text-rose-200">
            {errors.form}
          </div>
        ) : null}

        <AuthInput
          label="邮箱"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <AuthInput
          label="密码"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="输入密码"
          value={password}
          error={errors.password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9a8f82] dark:text-slate-500">本地 mock 登录</span>
          <Link href="/login" className="text-[#8b6f47] transition hover:text-[#2f2a24] dark:text-indigo-200 dark:hover:text-white">
            忘记密码？
          </Link>
        </div>

        <button
          type="submit"
          className="mt-1 rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-5 py-3 text-sm font-semibold text-[#2f2a24] shadow-[0_16px_34px_rgba(120,95,60,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(120,95,60,0.22)] dark:bg-none dark:bg-indigo-400 dark:text-slate-950 dark:shadow-[0_0_32px_rgba(129,140,248,0.25)]"
        >
          登录
        </button>
      </form>
    </AuthCard>
  );
}
