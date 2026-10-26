import { useMemo, useState } from 'react'
import { getReferralContext } from './referralContext'
import { loadRecent, addRecent } from './recentReferrals'
import AppHeader from './components/AppHeader'
import HowItWorks from './components/HowItWorks'
import ReferralForm from './components/ReferralForm'
import RecentReferrals from './components/RecentReferrals'
import './App.css'
import './glossy.css'

const YEAR = new Date().getFullYear()

export default function App() {
  const context = useMemo(() => getReferralContext(), [])
  const [recent, setRecent] = useState(() => loadRecent(context))
  const firstName = context.referrerName.split(' ')[0]

  return (
    <div className="app glossy">
      <AppHeader context={context} />

      <main className="content">
        <div className="hero">
          <h1>
            {firstName
              ? <>Know someone, <span>{firstName}?</span></>
              : <>Know someone <span>who’d benefit?</span></>}
          </h1>
          <p>Refer them in under a minute. We’ll take it from there and give them a call.</p>
        </div>

        <div className="layout">
          <ReferralForm
            context={context}
            onSubmitted={(referred) => setRecent((items) => addRecent(context, items, referred))}
          />
          <aside className="sidebar">
            <HowItWorks />
            <RecentReferrals items={recent} />
          </aside>
        </div>
      </main>

      <footer className="credit">
        Made with
        <svg className="credit-heart" viewBox="0 0 24 24" width="14" height="14" aria-label="love" role="img">
          <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4.4.7 1.6.7 2 0 .7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
        </svg>
        by <strong>Handysolver</strong> © {YEAR}
      </footer>
    </div>
  )
}
