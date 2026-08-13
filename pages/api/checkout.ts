import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import {
  TICKET_CAPACITY,
  MAX_QUANTITY_PER_ORDER,
  TICKET_METADATA_KEY,
  TICKET_METADATA_VALUE,
  getTicketsSoldCount,
} from "@/lib/tickets";
import { SITE_URL } from "@/lib/site";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const quantity = Number(req.body?.quantity);

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_QUANTITY_PER_ORDER
  ) {
    return res.status(400).json({ error: "invalid_quantity" });
  }

  const sold = await getTicketsSoldCount();
  const remaining = Math.max(0, TICKET_CAPACITY - sold);

  if (quantity > remaining) {
    return res.status(409).json({ error: "sold_out" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID as string,
          quantity,
        },
      ],
      payment_intent_data: {
        metadata: {
          [TICKET_METADATA_KEY]: TICKET_METADATA_VALUE,
        },
      },
      custom_fields: [
        {
          key: "purchaser_name",
          label: { type: "custom", custom: "Full name" },
          type: "text",
        },
      ],
      success_url: `${SITE_URL}/tickets/thank-you`,
      cancel_url: `${SITE_URL}/tickets`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe checkout session:", error);
    return res.status(500).json({ error: "checkout_failed" });
  }
}
