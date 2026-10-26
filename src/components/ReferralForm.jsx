import { useState } from 'react'
import { submitReferral } from '../referralService'
import { UserIcon, PhoneIcon, MailIcon, NoteIcon, SendIcon, CheckIcon, AlertIcon, PlusIcon, LockIcon } from './icons'

const EMPTY_FORM = { fullName: '', phone: '', email: '', service: '', notes: '' }
const SERVICES = ['CRM', 'HRMS', 'Invoicing', 'Opticals']
const NOTES_MAX = 500
const COIN_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form, referrerName, referrerEmail) {
  const errors = {}
  if (!referrerName.trim()) errors.referrerName = 'Please enter your name.'
  if (!referrerEmail.trim()) errors.referrerEmail = 'Please enter your email so we know who referred them.'
  else if (!EMAIL_RE.test(referrerEmail.trim())) errors.referrerEmail = 'That email address doesn’t look right.'

  if (!form.fullName.trim()) errors.fullName = 'Please enter their name.'

  const digits = form.phone.replace(/[^\d]/g, '')
  if (!form.phone.trim()) errors.phone = 'Please enter their phone number.'
  else if (digits.length < 7 || digits.length > 15) errors.phone = 'That phone number doesn’t look right.'

  if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
    errors.email = 'That email address doesn’t look right.'
  }

  if (!form.service) errors.service = 'Please pick a service.'
  return errors
}

export default function ReferralForm({ context, onSubmitted }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const [submittedName, setSubmittedName] = useState('')
  const [closeBlocked, setCloseBlocked] = useState(false)
  // The referrer's name and email come from the Refer button's link when available and are locked then.
  // Otherwise they type them once and they're kept for their next referral.
  const nameFromLink = context.referrerName.trim()
  const emailFromLink = context.referrerEmail.trim()
  const [referrerName, setReferrerName] = useState(nameFromLink)
  const [referrerEmail, setReferrerEmail] = useState(emailFromLink)

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const found = validate(form, referrerName, referrerEmail)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }

    setStatus('submitting')
    const referred = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      service: form.service,
      notes: form.notes.trim(),
    }
    try {
      await submitReferral({ referred, referrer: { ...context, referrerName: referrerName.trim(), referrerEmail: referrerEmail.trim() } })
      onSubmitted?.(referred)
      setSubmittedName(referred.fullName)
      setForm(EMPTY_FORM)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  // Browsers only let a page close a tab that another page opened with window.open
  // (our Refer button). If the tab was opened by hand, the call is silently ignored,
  // so check shortly after and tell the person to close it themselves.
  function closeTab() {
    window.close()
    setTimeout(() => {
      if (!window.closed) setCloseBlocked(true)
    }, 300)
  }

  function referAnother() {
    setCloseBlocked(false)
    setStatus('idle')
  }

  if (status === 'done') {
    return (
      <section className="panel form-panel success">
        <div className="success-badge-wrap">
          <div className="success-badge"><CheckIcon size={30} /></div>
          {/* Decorative coin burst + "+5%" tag */}
          <span className="success-burst" aria-hidden="true">
            {COIN_ANGLES.map((a, i) => (
              <i key={a} style={{ '--a': `${a}deg`, '--d': `${i % 2 ? 58 : 74}px`, '--delay': `${0.25 + i * 0.04}s` }} />
            ))}
          </span>
          <span className="success-reward-pop" aria-hidden="true">+5%</span>
        </div>
        <h2>Referral sent</h2>
        <p>Thanks! We’ll reach out to <strong>{submittedName}</strong> soon.</p>
        <div className="reward-note">
          <span className="chip-coin" aria-hidden="true" />
          <span>You’ll get <strong>5%</strong> when {submittedName} converts.</span>
        </div>
        <div className="actions">
          <button type="button" className="btn primary" onClick={referAnother}>
            <PlusIcon size={18} /> Refer someone else
          </button>
          <button type="button" className="btn ghost" onClick={closeTab}>
            Close this tab
          </button>
        </div>
        {closeBlocked && (
          <p className="close-note" role="status">
            Your browser didn’t let us close this tab. You can close it yourself (Ctrl+W, or ⌘W on Mac).
          </p>
        )}
      </section>
    )
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
      <div className="panel-head">
        <h2 className="panel-title">New referral</h2>
        <span className="panel-meta"><span className="req">*</span> required</span>
      </div>

      <fieldset className="group">
        <legend>Your details</legend>
        <div className="row">
          <Field
            label="Your name"
            id="referrerName"
            icon={UserIcon}
            required
            error={errors.referrerName}
            badge={nameFromLink && <AutoFilled />}
          >
            <input
              id="referrerName"
              placeholder="e.g. Rahul Sharma"
              autoComplete="name"
              value={referrerName}
              readOnly={!!nameFromLink}
              onChange={(e) => {
                setReferrerName(e.target.value)
                if (errors.referrerName) setErrors((errs) => ({ ...errs, referrerName: undefined }))
              }}
            />
          </Field>
          <Field
            label="Your email"
            id="referrerEmail"
            icon={MailIcon}
            required
            error={errors.referrerEmail}
            badge={emailFromLink && <AutoFilled />}
          >
            <input
              id="referrerEmail"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={referrerEmail}
              readOnly={!!emailFromLink}
              onChange={(e) => {
                setReferrerEmail(e.target.value)
                if (errors.referrerEmail) setErrors((errs) => ({ ...errs, referrerEmail: undefined }))
              }}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="group">
        <legend>Who are you referring?</legend>
        <div className="row three">
          <Field label="Their full name" id="fullName" icon={UserIcon} required error={errors.fullName}>
            <input id="fullName" placeholder="e.g. Priya Patel" autoComplete="off" value={form.fullName} onChange={update('fullName')} />
          </Field>
          <Field label="Their phone number" id="phone" icon={PhoneIcon} required error={errors.phone}>
            <input id="phone" type="tel" inputMode="tel" placeholder="+91 98765 43210" autoComplete="off" value={form.phone} onChange={update('phone')} />
          </Field>
          <Field label="Their email" id="email" icon={MailIcon} error={errors.email}>
            <input id="email" type="email" placeholder="name@example.com" autoComplete="off" value={form.email} onChange={update('email')} />
          </Field>
        </div>
      </fieldset>

      <fieldset className={`group${errors.service ? ' has-error' : ''}`}>
        <legend>Which service are you referring them for? <span className="req">*</span></legend>
        <div className="pills" role="radiogroup" aria-label="Service">
          {SERVICES.map((s, i) => (
            <label key={s} className={`pill${form.service === s ? ' selected' : ''}`}>
              <input
                type="radio"
                name="service"
                id={i === 0 ? 'service' : undefined}
                value={s}
                checked={form.service === s}
                onChange={update('service')}
              />
              {form.service === s && <CheckIcon size={14} />}
              {s}
            </label>
          ))}
        </div>
        {errors.service && <small className="error">{errors.service}</small>}
      </fieldset>

      <fieldset className="group">
        <legend>Anything we should know?</legend>
        <Field
          label="Notes"
          id="notes"
          icon={NoteIcon}
          badge={<span className="char-count">{form.notes.length}/{NOTES_MAX}</span>}
        >
          <textarea id="notes" rows={2} maxLength={NOTES_MAX} placeholder="How you know them, best time to call…" value={form.notes} onChange={update('notes')} />
        </Field>
      </fieldset>

      {status === 'error' && (
        <p className="banner error-banner" role="alert">
          <AlertIcon size={18} /> Something went wrong sending the referral. Please try again.
        </p>
      )}

      <div className="form-footer">
        {/* Shown in the glossy theme only (hidden on the normal page in App.css). */}
        <p className="fine-print">We’ll only use these details to contact them about this referral.</p>
        <button type="submit" className="btn primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? <span className="spinner" aria-hidden="true" /> : <SendIcon size={18} />}
          {status === 'submitting' ? 'Sending…' : 'Submit referral'}
        </button>
      </div>
    </form>
  )
}

function AutoFilled() {
  return <span className="field-badge"><LockIcon size={12} /> Auto-filled</span>
}

function Field({ label, id, icon: FieldIcon, required, hint, error, badge, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="req"> *</span> : <span className="opt"> optional</span>}
        {badge}
      </label>
      <div className="control">
        {FieldIcon && <span className="control-icon"><FieldIcon size={18} /></span>}
        {children}
      </div>
      {error ? <small className="error">{error}</small> : hint && <small className="hint">{hint}</small>}
    </div>
  )
}
