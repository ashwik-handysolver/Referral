# Referral app

A single-page React app with a form for referring someone. Our other apps open it in a new tab from their **Refer** button.

## Run it

```bash
npm install
npm run dev
```

## Adding the Refer button to another app

Open this app in a new tab and pass who is referring in the URL:

```js
function openReferral(user) {
  const params = new URLSearchParams({
    source: 'crm',              // which app the referral came from
    referrerId: user.id,
    referrerName: user.name,
    referrerEmail: user.email,
  })
  window.open(`https://refer.example.com/?${params}`, '_blank')
}
```

All parameters are optional. Opening the tab with `window.open` lets the "Close this tab" button on the thank-you screen work.

## Where submissions go

Each referral is emailed to **connect@handysolver.com** through [EmailJS](https://www.emailjs.com) (free: 200 emails/month):

1. Sign up at emailjs.com.
2. **Email Services → Add New Service** (e.g. Gmail) and connect the account that sends the emails. Copy the **Service ID**.
3. **Email Templates → Create New Template**:
   - **Subject:** `New referral: {{referred_name}} (from {{referrer_name}})`
   - **To Email:** `connect@handysolver.com` (change this to send referrals elsewhere)
   - **Reply To:** `{{reply_to}}`
   - **Content:** switch to the code editor and paste all of `email/referral-email.html`.
   - Save and copy the **Template ID**.
4. **Account → General:** copy the **Public Key**.
5. Copy `.env.example` to `.env.local`, fill in the three values, and restart `npm run dev`.

Without these values, referrals are only logged to the browser console. The code is in `src/referralService.js`.
