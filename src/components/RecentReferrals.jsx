import { ClockIcon, UsersIcon } from './icons'

function timeAgo(iso) {
  const secs = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.round(secs / 60)
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} h ago`
  return new Date(iso).toLocaleDateString()
}

export default function RecentReferrals({ items }) {
  return (
    <section className="panel recent">
      <div className="panel-head">
        <h2 className="panel-title">Your referrals</h2>
        {items.length > 0 && <span className="count">{items.length}</span>}
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <span className="empty-icon"><UsersIcon size={22} /></span>
          <p>No referrals yet. People you refer will show up here.</p>
          {/* Reward teaser: glossy theme only (hidden on the normal page in App.css) */}
          <span className="reward-chip"><span className="chip-coin" aria-hidden="true" />Earn 10% for every referral that converts</span>
        </div>
      ) : (
        <ul className="recent-list">
          {items.map((r) => (
            <li key={r.id} className="recent-item">
              <span className="avatar sm">{r.fullName.charAt(0).toUpperCase()}</span>
              <div className="recent-text">
                <strong>{r.fullName}</strong>
                <span>{r.phone} · {timeAgo(r.submittedAt)}</span>
              </div>
              <span className="status-pill"><ClockIcon size={13} /> Awaiting call</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
