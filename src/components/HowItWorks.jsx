import { NoteIcon, PhoneIcon, CoinIcon } from './icons'

const STEPS = [
  { icon: NoteIcon, title: 'Share their details', text: 'Just a name and phone number is enough.' },
  { icon: PhoneIcon, title: 'We give them a call', text: 'Our team reaches out and introduces us.' },
  { icon: CoinIcon, title: 'That’s it', text: "You'll get 5% on a successful conversion." },
]

export default function HowItWorks() {
  return (
    <section className="panel how">
      <h2 className="panel-title">How it works</h2>
      <ol className="steps">
        {STEPS.map(({ icon: StepIcon, title, text }, i) => (
          <li key={title} className="step">
            <span className="step-icon">
              <StepIcon size={18} />
              {i === STEPS.length - 1 && (
                // Reward burst for the glossy theme's step animation (decorative)
                <>
                  <span className="coin-burst" aria-hidden="true"><i /><i /><i /></span>
                  <span className="reward-pop" aria-hidden="true">+5%</span>
                </>
              )}
            </span>
            <div>
              <span className="step-num"><span className="step-word">Step </span>{i + 1}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
