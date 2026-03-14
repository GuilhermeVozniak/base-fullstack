import Script from "next/script"

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
const PLAUSIBLE_URL = process.env.NEXT_PUBLIC_PLAUSIBLE_URL ?? "https://plausible.io"

export function Analytics() {
  if (!PLAUSIBLE_DOMAIN) return null

  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src={`${PLAUSIBLE_URL}/js/script.js`}
      strategy="afterInteractive"
    />
  )
}
