// Parses the free-text `opening_hours` field into a weekly schedule and derives a live
// "open now / closes at / opens at" status for the current moment in the UK. Handles day
// ranges ("Tue–Thu"), comma day lists ("Mon-Thu, Sun"), "Daily", meal-period prefixes
// ("Lunch Fri-Sun: ..."), multiple blocks per day joined by "," or "&", 24-hour clock
// times, and harmless parenthetical detail ("(kitchen till 10 PM)") — which gets
// stripped. Anything the source itself flags as uncertain ("approx", "varies", "see
// website"...) or that doesn't match the expected "Day: Time" shape is left unparsed
// and simply produces no live status — never guessed.

type TimeBlock = { start: number; end: number }; // minutes since midnight; end may exceed 1440 if it crosses midnight
type WeekSchedule = TimeBlock[][]; // index 0=Sun..6=Sat, matching Intl/Date weekday numbering

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_INDEX: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

const TIME_RANGE_RE =
  /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i;

// Fallback for 24-hour clock times with no am/pm at all (e.g. "12:00–22:30").
// Only accepted when one side is unambiguously > 12 — otherwise a plain
// "9:00-5:00" typo could silently flip from an 8-hour to a 20-hour window.
const HOUR24_RANGE_RE = /^(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/;

// Parenthetical annotations that signal the source itself is unsure
// ("approx", "may vary", "see website"...) — when present, bail on the whole
// record rather than presenting a guess as a confident fact.
const UNCERTAINTY_RE = /vary|varies|varying|approx|unconfirm|see (website|google|instagram|facebook)|call ahead|tbc|subject to change/i;

function stripAnnotations(raw: string): string | null {
  let uncertain = false;
  const cleaned = raw.replace(/\(([^)]*)\)/g, (_, inner: string) => {
    if (UNCERTAINTY_RE.test(inner)) uncertain = true;
    return "";
  });
  return uncertain ? null : cleaned;
}

function dayIndexFromAbbr(abbr: string): number | undefined {
  return DAY_INDEX[abbr.trim().toLowerCase().slice(0, 3)];
}

function parseDayToken(token: string): number[] | null {
  // strip an optional leading meal-period label, e.g. "Lunch Fri-Sun" -> "Fri-Sun"
  const trimmed = token.trim().replace(/^(lunch|dinner|breakfast|brunch)\s+/i, "");

  if (/^(daily|every\s*day)$/i.test(trimmed)) return [0, 1, 2, 3, 4, 5, 6];

  const days = new Set<number>();
  for (const part of trimmed.split(",")) {
    const p = part.trim();
    if (!p) continue;
    const rangeMatch = p.match(/^([A-Za-z]{3,})\s*[–-]\s*([A-Za-z]{3,})$/);
    if (rangeMatch) {
      const startIdx = dayIndexFromAbbr(rangeMatch[1]);
      const endIdx = dayIndexFromAbbr(rangeMatch[2]);
      if (startIdx === undefined || endIdx === undefined) return null;
      let i = startIdx;
      for (let n = 0; n < 7; n++) {
        days.add(i);
        if (i === endIdx) break;
        i = (i + 1) % 7;
      }
      continue;
    }
    const single = dayIndexFromAbbr(p);
    if (single === undefined) return null;
    days.add(single);
  }
  return days.size ? Array.from(days) : null;
}

function to24(hour: number, minute: number, meridiem: string): number {
  const h = hour % 12;
  return (meridiem.toLowerCase() === "pm" ? h + 12 : h) * 60 + minute;
}

function parseTimeSpec(spec: string): TimeBlock[] | "closed" | null {
  const trimmed = spec.trim();
  if (/^closed$/i.test(trimmed)) return "closed";

  const blocks: TimeBlock[] = [];
  for (const partRaw of trimmed.split(/\s*[,&]\s*/)) {
    const part = partRaw.trim();
    if (!part) continue;

    const m = part.match(TIME_RANGE_RE);
    if (m) {
      const [, sh, sm, sMer, eh, em, eMer] = m;
      const startMeridiem = sMer ?? eMer;
      const startMin = to24(parseInt(sh, 10), sm ? parseInt(sm, 10) : 0, startMeridiem);
      let endMin = to24(parseInt(eh, 10), em ? parseInt(em, 10) : 0, eMer);
      if (endMin <= startMin) endMin += 24 * 60; // crosses midnight
      blocks.push({ start: startMin, end: endMin });
      continue;
    }

    const m24 = part.match(HOUR24_RANGE_RE);
    if (m24) {
      const [, sh, sm, eh, em] = m24;
      const sH = parseInt(sh, 10);
      const eH = parseInt(eh, 10);
      const sM = parseInt(sm, 10);
      const eM = parseInt(em, 10);
      if (sH > 23 || eH > 23 || sM > 59 || eM > 59) return null;
      if (Math.max(sH, eH) <= 12) return null; // ambiguous without a clear 24h marker
      const startMin = sH * 60 + sM;
      let endMin = eH * 60 + eM;
      if (endMin <= startMin) endMin += 24 * 60;
      blocks.push({ start: startMin, end: endMin });
      continue;
    }

    return null;
  }
  return blocks.length ? blocks : null;
}

function parseOpeningHours(rawInput: string): WeekSchedule | null {
  const raw = stripAnnotations(rawInput);
  if (raw === null) return null;
  const schedule: WeekSchedule = [[], [], [], [], [], [], []];
  for (const segment of raw.split("|")) {
    const colonIdx = segment.indexOf(":");
    if (colonIdx === -1) return null;
    const days = parseDayToken(segment.slice(0, colonIdx));
    if (!days) return null;
    const time = parseTimeSpec(segment.slice(colonIdx + 1));
    if (time === null) return null;
    // accumulate rather than overwrite — the same day can appear in more than
    // one segment (e.g. separate "Lunch" and "Dinner" entries)
    for (const d of days) schedule[d] = time === "closed" ? [] : [...schedule[d], ...time];
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

// `changeLabel` is just the time (and day, if not today) the status next
// flips — e.g. "10 PM" or "11:30 AM Tue" — so callers can compose their own
// wording ("Closes at" / "Opens at") instead of parsing a sentence back apart.
export type LiveStatus = { open: boolean; changeLabel: string | null };

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
      return { open: true, changeLabel: formatTime(block.end) };
    }
  }

  for (const block of schedule[todayIdx]) {
    if (nowMin >= block.start && nowMin < Math.min(block.end, 1440)) {
      return { open: true, changeLabel: formatTime(block.end) };
    }
  }

  for (let offset = 0; offset < 7; offset++) {
    const dayIdx = (todayIdx + offset) % 7;
    const candidates = schedule[dayIdx].filter((b) => (offset === 0 ? b.start > nowMin : true));
    if (candidates.length === 0) continue;
    const next = candidates.reduce((a, b) => (a.start < b.start ? a : b));
    const when = offset === 0 ? formatTime(next.start) : `${formatTime(next.start)} ${DAY_LABELS[dayIdx]}`;
    return { open: false, changeLabel: when };
  }

  return { open: false, changeLabel: null };
}
