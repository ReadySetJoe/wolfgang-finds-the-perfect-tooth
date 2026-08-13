import { stripe } from "./stripe";
import {
  TICKET_UNIT_PRICE_CENTS,
  TICKET_METADATA_KEY,
  TICKET_METADATA_VALUE,
} from "./tickets-config";

export {
  TICKET_CAPACITY,
  TICKET_UNIT_PRICE_CENTS,
  MAX_QUANTITY_PER_ORDER,
  TICKET_METADATA_KEY,
  TICKET_METADATA_VALUE,
} from "./tickets-config";

export async function getTicketsSoldCount(): Promise<number> {
  try {
    const paymentIntents = await stripe.paymentIntents
      .search({
        query: `status:"succeeded" AND metadata["${TICKET_METADATA_KEY}"]:"${TICKET_METADATA_VALUE}"`,
        limit: 100,
      })
      .autoPagingToArray({ limit: 1000 });

    const totalCents = paymentIntents.reduce((sum, pi) => sum + pi.amount, 0);

    return Math.round(totalCents / TICKET_UNIT_PRICE_CENTS);
  } catch (error) {
    // Fail open: an infra hiccup here shouldn't block ticket sales.
    // Stripe's own checkout session creation is the real backstop if
    // Stripe itself is unreachable.
    console.error("Failed to fetch tickets sold count from Stripe:", error);
    return 0;
  }
}
