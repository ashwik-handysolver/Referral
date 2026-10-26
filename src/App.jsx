import { useMemo, useState } from 'react'
import { getReferralContext } from './referralContext'
import { loadRecent, addRecent } from './recentReferrals'
import AppHeader from './components/AppHeader'
import HowItWorks from './components/HowItWorks'
import ReferralForm from './components/ReferralForm'
import RecentReferrals from './components/RecentReferrals'
import './App.css'
import './glossy.css'

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

      {/* <footer className="footer">Referral details are shared only with our team.</footer> */}
    </div>
  )
}
