"use client";

import katex from "katex";

type MathTextProps = {
  children: string;
  className?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderMathText(value: string) {
  const parts = value.split(/(\$[^$]+\$)/g);

  return parts
    .map((part) => {
      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        const formula = part.slice(1, -1);

        try {
          return katex.renderToString(formula, {
            throwOnError: false,
            strict: false,
          });
        } catch {
          return escapeHtml(part);
        }
      }

      return escapeHtml(part);
    })
    .join("");
}

export function MathText({ children, className = "" }: MathTextProps) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: renderMathText(children) }} />;
}
