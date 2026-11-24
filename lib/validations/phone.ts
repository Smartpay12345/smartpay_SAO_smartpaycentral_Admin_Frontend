// 0803..., 803..., +234803... (a convenience check; the server is the authority)
const NG_PHONE = /^(\+?234|0)?[789][01]\d{8}$/
export const isNigerianPhone = (v: string) => NG_PHONE.test(v.replace(/[\s-]/g, ''))