import type { Rank, RankCriterion } from '@/lib/types/rank'

export function isRankUnlocked(rank: Rank): boolean {
  return rank.criteria.every((c) => c.current >= c.target)
}

export function criterionPercent(c: RankCriterion): number {
  return Math.min(100, Math.round((c.current / c.target) * 100))
}

export function getCurrentRank(ranks: Rank[]): Rank | null {
  // the highest rank where every criterion is fully met
  let current: Rank | null = null
  for (const rank of ranks) {
    if (isRankUnlocked(rank)) current = rank
  }
  return current
}

export function getNextRank(ranks: Rank[], current: Rank | null): Rank | null {
  if (!current) return ranks[0] ?? null
  const idx = ranks.findIndex((r) => r.id === current.id)
  return ranks[idx + 1] ?? null
}

// overall progress toward the next rank, averaged across its criteria —
// matches the single "79%" figure shown next to "NEXT RANK TO"
export function nextRankOverallPercent(nextRank: Rank | null): number {
  if (!nextRank) return 0
  const percents = nextRank.criteria.map(criterionPercent)
  return Math.round(percents.reduce((a, b) => a + b, 0) / percents.length)
}