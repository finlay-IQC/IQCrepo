# The IQ Collective — Cold Traffic Paid Media Funnel

A four-page paid-media funnel for cold Meta traffic. Vanilla HTML, CSS, and JS —
no framework, no build step. Deploys as static files to any host (GitHub Pages,
Netlify, Vercel, Cloudflare Pages, etc.).

## File tree

```
/
  index.html          Landing page — sales copy + qualification form (Typeform)
  booking.html        Booking page — GHL calendar only (qualified leads)
  unqualified.html    Not-a-fit page — no calendar
  thank-you.html      Confirmation page — accept the calendar invite (video placeholder)
  privacy.html        Privacy policy placeholder
  terms.html          Terms of service placeholder
  styles.css          All styling ("Ink & Rust" — off-white, near-black, rust accent)
  script.js           UTM capture/forwarding, Typeform hidden fields, sticky CTA, FAQ accordion
  assets/             Testimonial video + poster live here (see assets/README.md)
```

## Landing page section order

Header (centered logo) → Hero → Trusted By (rolling logo marquee) → Form (Typeform) →
Client Results (stat grid + Buckland video) → What We Install → Problem → Mechanism →
How it works → What you get → Who this is for / not for → FAQ → Final CTA → Footer.

## Funnel flow

`index.html` (form) → **Typeform routes** → `booking.html` (qualified) *or*
`unqualified.html` (not qualified) → `thank-you.html` (after booking).

The landing page never links straight to the calendar. Only the form advances the visitor.

## ⚠️ Manual steps required before going live

These cannot be done from the code alone:

1. **Typeform routing** — add ONE rule on the revenue question:
   - `Under £1M/year` → redirect to `unqualified.html`
   - anything else (`£1M–£3M` / `£3M–£5M` / `£5M–£10M` / `£10M+`) → redirect to `booking.html`
   - Preserve UTM parameters on both paths.
2. **Typeform hidden fields** — create hidden fields named `utm_source`, `utm_medium`,
   `utm_campaign`, `utm_content`, `utm_term`. `script.js` passes live values via
   `data-tf-hidden`; without matching hidden fields, they're dropped.
3. **GHL calendar redirect** — set the booking widget to redirect to `thank-you.html`
   after a booking is made.
4. **Thank-you video** — compress `Video 1 C.mp4` (573MB) + self-host, or upload to
   YouTube/Vimeo/Cloudflare Stream, then replace the placeholder in `thank-you.html`.
5. **Proof video** — drop the 2.9MB Buckland `testimonial-v2.mp4` (+ poster) into `assets/`.
5b. **Logo (optional but recommended)** — the header logo loads from the client CDN. To
    self-host, download it to `assets/logo.png` and point the masthead `<img src>` at it.
6. **Tracking** — paste pixels/tags into the clearly-marked `<!-- TRACKING ... -->` slots
   on every page. Fire the booked-call conversion **only** on `thank-you.html`.
7. **Attribution** — confirm the Meta ad URLs pass an ad-specific value
   (e.g. `utm_content={{ad.name}}` or `{{ad.id}}`) so the UTM chain has something to carry.

## Brand direction

"Ink & Rust": warm off-white background, near-black warm ink, one restrained rust/clay
accent. Serif headlines (editorial), system-sans body. Deliberately avoids the retired
heritage-green / parchment identity and any AI-SaaS look (no gradients, glass, neon, or
generic icon grids).
