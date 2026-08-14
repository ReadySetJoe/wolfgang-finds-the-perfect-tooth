const EVENT_TITLE = "Wolfgang Finds the Perfect Tooth";
const EVENT_LOCATION = "Centre Stage, Greenville, SC";
const EVENT_DESCRIPTION = "Hell awaits.";
const EVENT_START = new Date("2026-10-17T19:00:00-04:00");
const EVENT_END = new Date("2026-10-17T21:00:00-04:00");

function toUtcTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
}

export function buildGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_TITLE,
    dates: `${toUtcTimestamp(EVENT_START)}/${toUtcTimestamp(EVENT_END)}`,
    details: EVENT_DESCRIPTION,
    location: EVENT_LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsDataUrl(): string {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wolfgang Finds the Perfect Tooth//EN",
    "BEGIN:VEVENT",
    "UID:wolfgang-finds-the-perfect-tooth-2026@theperfecttooth.com",
    `DTSTAMP:${toUtcTimestamp(new Date())}`,
    `DTSTART:${toUtcTimestamp(EVENT_START)}`,
    `DTEND:${toUtcTimestamp(EVENT_END)}`,
    `SUMMARY:${EVENT_TITLE}`,
    `DESCRIPTION:${EVENT_DESCRIPTION}`,
    `LOCATION:${EVENT_LOCATION}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
