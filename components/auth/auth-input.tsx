import type { InputHTMLAttributes } from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function AuthInput({ label, error, id, className = "", ...props }: AuthInputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block">
      <span className="text-sm font-medium text-[#4b4238] dark:text-slate-200">{label}</span>
      <input
        id={inputId}
        className={`mt-2 w-full rounded-lg border border-[rgba(190,170,140,0.24)] bg-[rgba(255,252,245,0.52)] px-4 py-3 text-sm text-[#2f2a24] outline-none transition placeholder:text-[#9a8f82] focus:border-[rgba(201,166,107,0.52)] focus:bg-[rgba(255,252,245,0.76)] focus:shadow-[0_12px_28px_rgba(120,95,60,0.1)] dark:border-white/10 dark:bg-slate-950/30 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-300/50 dark:focus:bg-slate-950/45 ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span id={inputId ? `${inputId}-error` : undefined} className="mt-2 block text-xs leading-5 text-rose-700 dark:text-rose-200">
          {error}
        </span>
      ) : null}
    </label>
  );
}
