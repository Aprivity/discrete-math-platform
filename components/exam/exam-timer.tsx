"use client";

import { useEffect, useState } from "react";

type ExamTimerProps = {
  deadlineAt: string;
  onExpire: () => void;
};

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ExamTimer({ deadlineAt, onExpire }: ExamTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.max(0, Math.ceil((new Date(deadlineAt).getTime() - Date.now()) / 1000)),
  );
  const isAlmostOver = remainingSeconds <= 5 * 60;

  useEffect(() => {
    const syncRemaining = () => {
      const nextRemainingSeconds = Math.max(0, Math.ceil((new Date(deadlineAt).getTime() - Date.now()) / 1000));
      setRemainingSeconds(nextRemainingSeconds);

      if (nextRemainingSeconds <= 0) {
        onExpire();
      }
    };

    syncRemaining();
    const timer = window.setInterval(syncRemaining, 1000);

    return () => window.clearInterval(timer);
  }, [deadlineAt, onExpire]);

  return (
    <div
      className={`rounded-lg border px-4 py-3 font-mono text-xl font-semibold ${
        isAlmostOver
          ? "border-rose-300/40 bg-rose-100/55 text-rose-800 dark:border-rose-300/25 dark:bg-rose-400/10 dark:text-rose-200"
          : "border-[rgba(201,166,107,0.28)] bg-[rgba(255,244,214,0.52)] text-[#8b6f47] dark:border-indigo-300/25 dark:bg-indigo-400/10 dark:text-indigo-100"
      }`}
    >
      {formatSeconds(remainingSeconds)}
    </div>
  );
}
