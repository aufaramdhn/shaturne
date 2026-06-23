// Client-side validation — layer pertama untuk UX (§10.3).
// BUKAN pengganti validasi server; server tetap source of truth.

export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

export function isEmail(value: string): boolean {
  // Cukup ketat untuk UX, tidak mencoba 100% RFC 5322.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function minLength(value: string, n: number): boolean {
  return value.trim().length >= n
}

export function maxLength(value: string, n: number): boolean {
  return value.trim().length <= n
}
