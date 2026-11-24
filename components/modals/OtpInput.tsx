// components/modals/OtpInput.tsx
"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  length?: number;
}

export function OtpInput({ value, onChange, disabled, hasError, length = 6 }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // an empty box is stored as a space, so clearing the middle box doesn't shift the others
  const cells = Array.from({ length }, (_, i) => {
    const c = value[i];
    return c && c !== " " ? c : "";
  });

  function commit(next: string[]) {
    onChange(next.map((c) => c || " ").join("").trimEnd());
  }

  function focusAt(i: number) {
    refs.current[Math.min(Math.max(i, 0), length - 1)]?.focus();
  }

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const next = [...cells];
    next[i] = digit;
    commit(next);
    focusAt(i + 1);
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...cells];
      if (next[i]) {
        next[i] = "";
        commit(next);
      } else if (i > 0) {
        next[i - 1] = "";
        commit(next);
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      focusAt(i + 1);
    }
  }

  function handlePaste(i: number, e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    const next = [...cells];
    pasted
      .slice(0, length - i)
      .split("")
      .forEach((d, k) => {
        next[i + k] = d;
      });
    commit(next);
    focusAt(i + pasted.length);
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {cells.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          maxLength={1}
          autoFocus={i === 0}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.target.select()}
          className={cn(
            "h-12 w-10 rounded-lg border bg-gray-50 text-center text-lg font-semibold outline-none sm:w-12",
            "focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:opacity-60",
            hasError && "border-red-400"
          )}
        />
      ))}
    </div>
  );
}