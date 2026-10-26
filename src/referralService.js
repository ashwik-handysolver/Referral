// Sends a referral by email using EmailJS (https://www.emailjs.com).
// The email design lives in email/referral-email.html: paste it into your EmailJS template.
// The recipient (connect@handysolver.com) is set in that EmailJS template's "To Email" field.
// Set the three VITE_EMAILJS_* values in .env.local. Without them, referrals are only logged to the console.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const EMAILJS_URL = 'https://api.emailjs.com/api/v1.0/email/send'

const dash = (v) => (v && String(v).trim()) || '—'

export async function submitReferral({ referred, referrer }) {
  const submittedAt = new Date()

  // These names match the {{placeholders}} in email/referral-email.html.
  const params = {
    referred_name: referred.fullName,
    referred_phone: referred.phone,
    referred_phone_link: referred.phone.replace(/[^\d+]/g, ''),
    referred_email: dash(referred.email),
    notes: dash(referred.notes),
    referrer_name: dash(referrer.referrerName),
    referrer_email: dash(referrer.referrerEmail),
    referrer_id: dash(referrer.referrerId),
    source: dash(referrer.source),
    submitted_at: submittedAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    reply_to: referrer.referrerEmail || '',
  }

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.info('[referral] EmailJS not configured. Referral not emailed:', params)
    return { ok: true }
  }

  const res = await fetch(EMAILJS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: params,
    }),
  })
  if (!res.ok) throw new Error(`Email service responded with ${res.status}: ${await res.text()}`)
  return { ok: true }
}
