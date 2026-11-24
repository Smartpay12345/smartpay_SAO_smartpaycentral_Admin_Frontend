import React, { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricItem {
  id: string;
  title: string;
  value: string;
  icon: ReactNode;
  iconBgColor?: string;
  trend: { value: string; label: string; isPositive?: boolean | null }
}

interface StatsCardsGridProps {
  metrics: MetricItem[];
}

export function StatsCardsGrid({ metrics }: StatsCardsGridProps) {
  return (
    <div className="w-full rounded-2xl border bg-card  shadow-lg md:p-3 p-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {metrics.map((metric, index) => (
          <div
            key={metric.id}
            className={`flex items-center gap-4 ${
              index !== 0 ? "xl:border-l xl:border-border xl:pl-6" : ""
            }`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                metric.iconBgColor || "bg-[#FEF2F2] text-red-600 dark:bg-[#FFF7ED]"
              }`}
            >
              {metric.icon}
            </div>

            <div className="flex min-w-0 flex-col space-y-1">
              <span className="text-[11px] font-medium leading-tight text-muted-foreground line-clamp-2">
                {metric.title}
              </span>

              <h3 className="whitespace-nowrap font-bold text-[#111827] tracking-tight text-foreground">
                {metric.value}
              </h3>

              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px]">
              <span
  className={`flex shrink-0 items-center font-semibold ${
    metric.trend.isPositive === null
      ? "text-muted-foreground"
      : metric.trend.isPositive !== false
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-red-600 dark:text-red-400"
  }`}
>
  {metric.trend.isPositive === null ? null : metric.trend.isPositive !== false ? (
    <ArrowUpRight className="mr-0.5 h-3 w-3" />
  ) : (
    <ArrowDownRight className="mr-0.5 h-3 w-3" />
  )}
  {metric.trend.value}
</span>
                <span className="text-muted-foreground">{metric.trend.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}