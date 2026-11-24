// "Akorede Rukayat" -> "Akorede R."
export function formatAdminName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`
}

// "admin" -> "Admin", "sub_admin" -> "Sub Admin"
export function formatRole(role: string): string {
  return role.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}