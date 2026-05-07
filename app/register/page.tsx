"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { isValidEmail, registerUser } from "@/lib/auth";

type RegisterErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});

  const validate = () => {
    const nextErrors: RegisterErrors = {};
    const normalizedEmail = email.trim();

    if (!username.trim()) {
      nextErrors.username = "请输入用户名。";
    }

    if (!normalizedEmail) {
      nextErrors.email = "请输入邮箱。";
    } else if (!isValidEmail(normalizedEmail)) {
      nextErrors.email = "邮箱格式不正确。";
    }

    if (!password) {
      nextErrors.password = "请输入密码。";
    } else if (password.length < 6) {
      nextErrors.password = "密码长度至少 6 位。";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "请再次输入密码。";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "两次输入的密码不一致。";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const result = registerUser({ username, email, password, confirmPassword });

    if (!result.ok) {
      setErrors({ form: result.message });
      return;
    }

    router.push("/login");
  };

  return (
    <AuthCard
      title="创建账号"
      description="保存你的练习进度与错题记录"
      footer={
        <>
          已有账号？{" "}
          <Link href="/login" className="font-semibold text-[#8b6f47] hover:text-[#2f2a24] dark:text-indigo-200 dark:hover:text-white">
            去登录
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
          label="用户名"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Aprivity"
          value={username}
          error={errors.username}
          onChange={(event) => setUsername(event.target.value)}
        />
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
          autoComplete="new-password"
          placeholder="至少 6 位"
          value={password}
          error={errors.password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <AuthInput
          label="确认密码"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="再次输入密码"
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <p className="rounded-lg border border-[rgba(190,170,140,0.18)] bg-[rgba(255,244,214,0.42)] px-4 py-3 text-xs leading-6 text-[#6f665c] dark:border-white/10 dark:bg-white/10 dark:text-slate-400">
          当前为本地 mock 账号系统。正式上线时不会在 localStorage 保存明文密码。
        </p>

        <button
          type="submit"
          className="mt-1 rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-5 py-3 text-sm font-semibold text-[#2f2a24] shadow-[0_16px_34px_rgba(120,95,60,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(120,95,60,0.22)] dark:bg-none dark:bg-indigo-400 dark:text-slate-950 dark:shadow-[0_0_32px_rgba(129,140,248,0.25)]"
        >
          注册
        </button>
      </form>
    </AuthCard>
  );
}
