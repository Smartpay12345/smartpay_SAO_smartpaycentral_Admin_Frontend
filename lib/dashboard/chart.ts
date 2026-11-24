// x-axis labels with the same step between every one, so the axis never "jumps"
export function evenTicks(labels: string[], maxTicks = 8): string[] {
  if (labels.length <= 12) return labels // a week, a year of months: show everything
  const step = Math.ceil(labels.length / maxTicks)
  return labels.filter((_, i) => i % step === 0)
}