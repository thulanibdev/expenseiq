export function parseAmount(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null
  const amount = Number(raw)
  if (!Number.isFinite(amount) || amount <= 0) return null
  const cents = Math.round(amount * 100)
  return cents > 0 && Number.isSafeInteger(cents) ? cents / 100 : null
}

export function toCSV(rows) {
  return rows.map(row => row.map(value => {
    let text = String(value ?? '')
    // Text entered by a user must not execute as a spreadsheet formula.
    if (typeof value === 'string' && /^[\s]*[=+@-]/.test(text)) text = "'" + text
    return '"' + text.replace(/"/g, '""') + '"'
  }).join(',')).join('\r\n')
}
