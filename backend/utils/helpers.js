/**
 * Safely parse a JSON string into an array, or return the array as-is.
 * Returns [] for any falsy / unparseable input.
 */
const safeParseArray = (val) => {
  if (!val) return []
  if (Array.isArray(val)) return val
  try { return JSON.parse(val) } catch { return [] }
}

/**
 * Escape HTML special characters to prevent XSS / HTML-injection
 * when embedding user input inside email templates.
 */
const escapeHtml = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

module.exports = { safeParseArray, escapeHtml }
