import { ArrowLeft } from "lucide-react";

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-6 flex items-center gap-1 text-xs font-medium text-gray-500 transition hover:text-red-600"
    >
      <ArrowLeft className="h-3 w-3" /> Back
    </button>
  );
}