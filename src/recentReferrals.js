// Keeps a short list of this person's recent referrals in the browser, so the
// app can show "Your referrals". It is only on this device; once the backend
// exists this list should come from there instead.
const MAX_ITEMS = 10

function storageKey(context) {
  return `referrals:recent:${context.referrerId || 'anonymous'}`
}

export function loadRecent(context) {
  try {
    const raw = localStorage.getItem(storageKey(context))
    const items = raw ? JSON.parse(raw) : []
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function saveRecent(context, items) {
  try {
    localStorage.setItem(storageKey(context), JSON.stringify(items.slice(0, MAX_ITEMS)))
  } catch {
    // Storage may be blocked (private mode etc.); the list just won't persist.
  }
}

export function addRecent(context, items, referred) {
  const entry = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    fullName: referred.fullName,
    phone: referred.phone,
    submittedAt: new Date().toISOString(),
  }
  const next = [entry, ...items].slice(0, MAX_ITEMS)
  saveRecent(context, next)
  return next
}
