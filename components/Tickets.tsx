import { useState } from "react";
import Ornament from "./Ornament";
import { MAX_QUANTITY_PER_ORDER } from "@/lib/tickets-config";

interface TicketsProps {
  remaining: number;
}

export default function Tickets({ remaining }: TicketsProps) {
  const maxQuantity = Math.min(remaining, MAX_QUANTITY_PER_ORDER);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(
          data.error === "sold_out"
            ? "Sorry, we just sold out."
            : "Something went wrong. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="animate-fade-in-up min-h-screen bg-gradient-to-b from-bg-dark via-bg-light to-bg-dark py-24 px-6">
      <div className="mx-auto max-w-xl text-center">
        <div className="relative flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
          <span className="text-gold text-[10px] tracking-[0.4em] uppercase text-center">
            Wolfgang Finds the Perfect Tooth
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <h1 className="font-heading text-4xl text-text-primary tracking-wider uppercase mb-4">
          Get Your Tickets
        </h1>
        <p className="text-sm text-red-soft italic mb-12">
          One night only. Hell doesn&apos;t wait.
        </p>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 mb-12">
          <div>
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-2">
              Date
            </p>
            <p className="text-lg text-text-primary">October 17, 2026</p>
          </div>
          <div>
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-2">
              Time
            </p>
            <p className="text-lg text-text-primary">7:00 PM</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-2">
              Venue
            </p>
            <p className="text-lg text-text-primary">Centre Stage</p>
            <p className="text-sm text-text-muted mt-1">Greenville, SC</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-2">
              Price
            </p>
            <p className="text-lg text-text-primary">
              $25 &middot; General Admission
            </p>
          </div>
        </div>

        <Ornament />

        {remaining <= 0 ? (
          <p className="font-heading text-lg text-red-soft uppercase tracking-wider">
            Sold Out
          </p>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-center gap-3">
              <label
                htmlFor="quantity"
                className="text-xs text-gold tracking-[0.3em] uppercase"
              >
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-bg-dark border border-gold text-text-primary px-3 py-2"
              >
                {Array.from({ length: maxQuantity }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={handleBuy}
              disabled={isSubmitting}
              className="inline-block border border-gold text-gold px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:bg-gold hover:text-bg-dark disabled:opacity-50"
            >
              {isSubmitting ? "Redirecting..." : "Buy Tickets"}
            </button>

            {error && <p className="text-sm text-red-soft mt-4">{error}</p>}
          </>
        )}

        <p className="text-xs text-text-muted mt-6">
          You&apos;ll complete your purchase securely via Stripe, then return
          here for confirmation.
        </p>
      </div>
    </section>
  );
}
