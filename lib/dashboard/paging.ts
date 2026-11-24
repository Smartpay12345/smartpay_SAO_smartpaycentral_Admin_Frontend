export const withHasMore = <T extends { pagination: { page: number; total_pages: number } }>(r: T) => ({
  ...r,
  has_more: r.pagination.page < r.pagination.total_pages,
})