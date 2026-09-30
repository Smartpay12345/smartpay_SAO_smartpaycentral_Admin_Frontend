export function getTrendStyle(percentChange: number) {
  const isPositive = percentChange >= 0
  return {
    isPositive,
    color: isPositive ? 'text-green-600' : 'text-red-500',
    sign: isPositive ? '+' : '',
  }
}