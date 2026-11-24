import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
}

export function FormField({ label, type = "text", placeholder, registration, error, disabled }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        disabled={disabled}
        className={cn(
          "w-full rounded-xl border bg-gray-50/70 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white",
          error ? "border-red-300 focus:border-red-500" : "border-gray-100 focus:border-red-500"
        )}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}