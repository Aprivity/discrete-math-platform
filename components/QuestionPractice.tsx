"use client";

import { useState } from "react";
import type { Question } from "@/data/questions";

type QuestionPracticeProps = {
  questions: Question[];
};

type SubmittedAnswers = Record<string, string>;

export function QuestionPractice({ questions }: QuestionPracticeProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<SubmittedAnswers>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<SubmittedAnswers>({});

  const chooseAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers((current) => ({ ...current, [questionId]: answer }));
  };

  const submitAnswer = (questionId: string) => {
    const selectedAnswer = selectedAnswers[questionId];

    if (!selectedAnswer) {
      return;
    }

    setSubmittedAnswers((current) => ({ ...current, [questionId]: selectedAnswer }));
  };

  return (
    <div className="grid gap-5">
      {questions.map((question, index) => {
        const selectedAnswer = selectedAnswers[question.id];
        const submittedAnswer = submittedAnswers[question.id];
        const isSubmitted = Boolean(submittedAnswer);
        const isCorrect = submittedAnswer === question.answer;
        const explanation = question.explanation.trim() || "解析待补充";

        return (
          <article
            key={question.id}
            className="rounded-lg border border-[rgba(190,170,140,0.22)] bg-[rgba(255,252,245,0.7)] p-6 shadow-[0_18px_50px_rgba(120,95,60,0.1)] backdrop-blur-[18px] dark:border-white/10 dark:bg-white/[0.07] dark:shadow-2xl dark:shadow-indigo-950/20"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-[rgba(190,170,140,0.24)] bg-[rgba(255,252,245,0.46)] px-3 py-1 font-mono text-[#8b6f47] dark:border-white/10 dark:bg-white/10 dark:text-indigo-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="rounded-full bg-[rgba(255,244,214,0.58)] px-3 py-1 text-[#6f665c] dark:bg-indigo-300/15 dark:text-slate-300">
                {question.type === "judge" ? "判断题" : "单选题"}
              </span>
              <span className="rounded-full bg-[rgba(255,244,214,0.58)] px-3 py-1 text-[#6f665c] dark:bg-indigo-300/15 dark:text-slate-300">
                {question.difficulty}
              </span>
            </div>

            <h2 className="mt-5 whitespace-pre-wrap text-xl font-semibold leading-8 text-[#2f2a24] dark:text-white">
              {question.title}
            </h2>

            <div className="mt-5 grid gap-3">
              {(question.options ?? []).map((option) => {
                const value = question.type === "single" ? option.slice(0, 1) : option;
                const isSelected = selectedAnswer === value;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => chooseAnswer(question.id, value)}
                    className={`rounded-lg border px-4 py-3 text-left text-sm leading-6 transition ${
                      isSelected
                        ? "border-[rgba(201,166,107,0.5)] bg-[rgba(255,244,214,0.74)] text-[#2f2a24] shadow-[0_12px_28px_rgba(120,95,60,0.12)] dark:border-indigo-300/60 dark:bg-indigo-400/20 dark:text-white"
                        : "border-[rgba(190,170,140,0.2)] bg-[rgba(255,252,245,0.42)] text-[#4b4238] hover:border-[rgba(201,166,107,0.36)] hover:bg-[rgba(255,244,214,0.56)] dark:border-white/10 dark:bg-slate-950/25 dark:text-slate-300 dark:hover:border-indigo-300/40 dark:hover:bg-indigo-400/10"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => submitAnswer(question.id)}
                disabled={!selectedAnswer}
                className="rounded-lg bg-gradient-to-r from-[#c9a66b] to-[#e8cfa3] px-5 py-3 text-sm font-semibold text-[#2f2a24] shadow-[0_16px_34px_rgba(120,95,60,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-none dark:bg-indigo-400 dark:text-slate-950 dark:shadow-[0_0_32px_rgba(129,140,248,0.25)]"
              >
                提交
              </button>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span key={tag} className="rounded-full px-2.5 py-1 text-xs text-[#9a8f82] dark:text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {isSubmitted ? (
              <div
                className={`mt-5 rounded-lg border p-4 text-sm leading-7 ${
                  isCorrect
                    ? "border-emerald-300/40 bg-emerald-100/45 text-emerald-800 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-200"
                    : "border-rose-300/40 bg-rose-100/45 text-rose-800 dark:border-rose-300/25 dark:bg-rose-400/10 dark:text-rose-200"
                }`}
              >
                <p className="font-semibold">{isCorrect ? "回答正确" : "回答错误"}</p>
                <p className="mt-1">正确答案：{question.answer}</p>
                <p className="mt-1">解析：{explanation}</p>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
