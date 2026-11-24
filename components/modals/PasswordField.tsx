// components/modals/PasswordField.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface PasswordFieldProps {
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
}

export function PasswordField({
  label,
  placeholder,
  registration,
  error,
  autoComplete = "current-password",
  disabled = false,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...registration}
          disabled={disabled}
          className="w-full rounded-lg border bg-gray-50 px-3 py-3 pr-10 text-sm outline-none focus:border-red-400"
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}