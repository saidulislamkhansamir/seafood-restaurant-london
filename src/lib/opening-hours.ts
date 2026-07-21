// Parses the free-text `opening_hours` field (e.g. "Mon: Closed | Tue–Thu: 6–10 PM | Fri–Sat: 12–10 PM")
// into a weekly schedule and derives a live "open now / closes at / opens at" status for
// the current moment in the UK. Rows that don't match the expected "Day: Time" shape
// (e.g. "see website", "onwards") are left unparsed and simply produce no live status —
// never guessed.

type TimeBlock = { start: number; end: number }; // minutes since midnight; end may exceed 1440 if it crosses midnight
type WeekSchedule = TimeBlock[][]; // index 0=Sun..6=Sat, matching Intl/Date weekday numbering

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_INDEX: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

const TIME_RANGE_RE =
  /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i;

function dayIndexFromAbbr(abbr: string): number | undefined {
  return DAY_INDEX[abbr.trim().toLowerCase().slice(0, 3)];
}

function parseDayToken(token: string): number[] | null {
  const trimmed = token.trim();
  const rangeMatch = trimmed.match(/^([A-Za-z]{3,})\s*[–-]\s*([A-Za-z]{3,})$/);
  if (rangeMatch) {
    const startIdx = dayIndexFromAbbr(rangeMatch[1]);
    const endIdx = dayIndexFromAbbr(rangeMatch[2]);
    if (startIdx === undefined || endIdx === undefined) return null;
    const days: number[] = [];
    let i = startIdx;
    for (let n = 0; n < 7; n++) {
      days.push(i);
      if (i === endIdx) break;
      i = (i + 1) % 7;
    }
    return days;
  }
  const single = dayIndexFromAbbr(trimmed);
  return single === undefined ? null : [single];
}

function to24(hour: number, minute: number, meridiem: string): number {
  const h = hour % 12;
  return (meridiem.toLowerCase() === "pm" ? h + 12 : h) * 60 + minute;
}

function parseTimeSpec(spec: string): TimeBlock[] | "closed" | null {
  const trimmed = spec.trim();
  if (/^closed$/i.test(trimmed)) return "closed";

  const blocks: TimeBlock[] = [];
  for (const part of trimmed.split(",")) {
    const m = part.trim().match(TIME_RANGE_RE);
    if (!m) return null;
    const [, sh, sm, sMer, eh, em, eMer] = m;
    const startMeridiem = sMer ?? eMer;
    const startMin = to24(parseInt(sh, 10), sm ? parseInt(sm, 10) : 0, startMeridiem);
    let endMin = to24(parseInt(eh, 10), em ? parseInt(em, 10) : 0, eMer);
    if (endMin <= startMin) endMin += 24 * 60; // crosses midnight
    blocks.push({ start: startMin, end: endMin });
  }
  return blocks;
}

function parseOpeningHours(raw: string): WeekSchedule | null {
  const schedule: WeekSchedule = [[], [], [], [], [], [], []];
  for (const segment of raw.split("|")) {
    const colonIdx = segment.indexOf(":");
    if (colonIdx === -1) return null;
    const days = parseDayToken(segment.slice(0, colonIdx));
    if (!days) return null;
    const time = parseTimeSpec(segment.slice(colonIdx + 1));
    if (time === null) return null;
    for (const d of days) schedule[d] = time === "closed" ? [] : time;
  }
  return schedule;
}

function formatTime(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  let h = Math.floor(m / 60);
  const mm = m % 60;
  const meridiem = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return mm === 0 ? `${h} ${meridiem}` : `${h}:${String(mm).padStart(2, "0")} ${meridiem}`;
}

export type LiveStatus = { open: boolean; text: string };

export function getLiveStatus(openingHours: string | null, now: Date = new Date()): LiveStatus | null {
  if (!openingHours) return null;
  const schedule = parseOpeningHours(openingHours);
  if (!schedule) return null;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const weekdayAbbr = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const todayIdx = DAY_LABELS.findIndex((d) => weekdayAbbr.startsWith(d));
  if (todayIdx === -1) return null;
  const nowMin = hour * 60 + minute;

  // still open from a block that started yesterday and crosses midnight into today
  const yesterdayIdx = (todayIdx + 6) % 7;
  for (const block of schedule[yesterdayIdx]) {
    if (block.end > 1440 && nowMin < block.end - 1440) {
      return { open: true, text: `Open now · closes ${formatTime(block.end)}` };
    }
  }

  for (const block of schedule[todayIdx]) {
    if (nowMin >= block.start && nowMin < Math.min(block.end, 1440)) {
      return { open: true, text: `Open now · closes ${formatTime(block.end)}` };
    }
  }

  for (let offset = 0; offset < 7; offset++) {
    const dayIdx = (todayIdx + offset) % 7;
    const candidates = schedule[dayIdx].filter((b) => (offset === 0 ? b.start > nowMin : true));
    if (candidates.length === 0) continue;
    const next = candidates.reduce((a, b) => (a.start < b.start ? a : b));
    const when = offset === 0 ? formatTime(next.start) : `${formatTime(next.start)} ${DAY_LABELS[dayIdx]}`;
    return { open: false, text: `Closed now · opens ${when}` };
  }

  return { open: false, text: "Closed now" };
}
