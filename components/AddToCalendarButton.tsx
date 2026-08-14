import { useState } from "react";
import { buildGoogleCalendarUrl, buildIcsDataUrl } from "@/lib/calendar";

export default function AddToCalendarButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="inline-block border border-gold text-gold px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:bg-gold hover:text-bg-dark"
      >
        Add to Calendar
      </button>
      {open && (
        <div className="mt-4 flex items-center justify-center gap-4 text-xs tracking-[0.2em] uppercase text-text-muted">
          <a
            href={buildGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors duration-300"
          >
            Google Calendar
          </a>
          <span className="text-gold">&middot;</span>
          <a
            href={buildIcsDataUrl()}
            download="wolfgang-finds-the-perfect-tooth.ics"
            className="hover:text-gold transition-colors duration-300"
          >
            Apple / Outlook
          </a>
        </div>
      )}
    </div>
  );
}
