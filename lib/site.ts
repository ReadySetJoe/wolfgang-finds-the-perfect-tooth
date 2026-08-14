export const SITE_URL = "https://theperfecttooth.com";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;
// Must remain query-string-free: components/Tickets.tsx appends
// ?client_reference_id=<source> directly, assuming no existing query string.
export const TICKETS_PAYMENT_LINK_URL =
  "https://book.stripe.com/test_eVqbJ36TUfhCghFc916J200";
