// Reads who is making the referral from the URL.
// The "Refer" button in our other apps opens this page like:
//   https://refer.example.com/?source=crm&referrerId=123&referrerName=Jane%20Doe&referrerEmail=jane@example.com
export function getReferralContext() {
  const params = new URLSearchParams(window.location.search)
  return {
    source: params.get('source') || '',
    referrerId: params.get('referrerId') || '',
    referrerName: params.get('referrerName') || '',
    referrerEmail: params.get('referrerEmail') || '',
  }
}
