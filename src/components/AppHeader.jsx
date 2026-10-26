import { HeartHandIcon } from './icons'

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function AppHeader({ context }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <span className="brand-mark"><HeartHandIcon size={18} /></span>
          <span className="brand-name">Referrals</span>
        </div>

        {context.referrerName ? (
          <div className="profile" title={context.referrerEmail || context.referrerName}>
            {context.source && <span className="source-badge">from {context.source}</span>}
            <div className="profile-text">
              <span className="profile-name">{context.referrerName}</span>
              {context.referrerEmail && <span className="profile-sub">{context.referrerEmail}</span>}
            </div>
            <span className="avatar">{initials(context.referrerName)}</span>
          </div>
        ) : (
          context.source && <span className="source-badge">from {context.source}</span>
        )}
      </div>
    </header>
  )
}
