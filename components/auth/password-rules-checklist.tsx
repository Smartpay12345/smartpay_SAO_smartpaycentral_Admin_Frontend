import { Check, Circle } from "lucide-react";
import { PASSWORD_RULES, passwordContainsEmailName } from "@/lib/validations/fields";
import { cn } from "@/lib/utils";

export function PasswordRulesChecklist({ value, email }: { value: string; email?: string }) {
  const items = [
    ...PASSWORD_RULES.map((r) => ({ key: r.key, label: r.label, ok: r.test(value) })),
    ...(email
      ? [{ key: "email", label: "Not part of your email", ok: value.length > 0 && !passwordContainsEmailName(value, email) }]
      : []),
  ];

  return (
    <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.key} className={cn("flex items-center gap-1.5 text-[11px]", item.ok ? "text-green-600" : "text-gray-400")}>
          {item.ok ? <Check className="h-3 w-3" /> : <Circle className="h-2.5 w-2.5" />}
          {item.label}
        </li>
      ))}
    </ul>
  );
}