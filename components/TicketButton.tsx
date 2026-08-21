import Link from "next/link";

export default function TicketButton() {
  return (
    <Link
      href="/tickets"
      className="inline-block border border-gold text-gold px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:bg-gold hover:text-bg-dark"
    >
      Sold Out
    </Link>
  );
}
