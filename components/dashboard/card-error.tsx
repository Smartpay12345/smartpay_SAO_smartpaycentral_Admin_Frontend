// components/dashboard/card-error.tsx
import type { EndpointError } from "@/hooks/use-endpoint";

export function CardError({ error, onRetry }: { error: EndpointError; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-2 rounded-xl border border-red-100 bg-red-50/50 p-4 text-xs text-red-600">
      <span>{error.message}</span>
      <button type="button" onClick={onRetry} className="font-semibold underline">
        Try again
      </button>
    </div>
  );
}