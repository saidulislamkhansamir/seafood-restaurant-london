const GROUP_RULES: { label: string; test: RegExp }[] = [
  { label: "Accessibility", test: /wheelchair|accessib|step-free/i },
  { label: "Dietary Options", test: /vegan|vegetarian|gluten.?free|halal|dairy.?free|alcohol-free|no alcohol|healthy options/i },
  {
    label: "Outdoor & Seating",
    test: /outdoor|al.?fresco|rooftop|roof terrace|terrace|beer garden|river.?view|riverside|counter seating|garden|canal.?side|courtyard|patio/i,
  },
  { label: "Parking", test: /parking/i },
  {
    label: "Ambience & Extras",
    test: /\bbar\b|bar\/|bar on|bar seating|bar service|wine|cocktail|happy hour|live (music|dj|entertainment|sports|gaming)|dj nights|shisha|spa\b|lgbtq|dog|pet friendly|fine dining|upscale|private (dining|room|booth|event|hire|party)|tasting menu|afternoon tea|brunch|breakfast|lunch|dinner|open kitchen|dress code|casual|hotel restaurant|late.?night|romantic|sushi bar|sushi counter|sunday roast|sake|chef's table|karaoke|function room|banqueting|event (space|venue)|venue hire|group (banqueting|bookings|dining)|small groups|good for (groups|special)|vip seating|pre-theatre|sharing plates|pop-up|market stall|street food|deli counter|bakery|grocery|gift shop|coworking|concierge|room service|rooms available|door policy|members welcome|non-residents|loyalty|slow food|wood-fired|wood-panelled|zinc bar|great view|small.*venue|alcohol|byob|casino|groups\/events|in-room dining|department store|sports on tv/i,
  },
  {
    label: "Practical Info",
    test: /reservation|dine.?in|takeaway|delivery|good for groups|group dining|credit card|apple pay|cash and card|wi.?fi|no booking|booking recommended|no reservation|walk-in|self.?service|table service|counter service|quick bite|click.{1,3}collect|family friendly|child|highchair|limited seating|indoor seating only|no fixed menu|catering/i,
  },
];

export type AttributeGroup = { label: string; items: string[] };

export function groupAttributes(attributes: string[]): AttributeGroup[] {
  const buckets = new Map<string, string[]>();

  for (const attr of attributes) {
    const rule = GROUP_RULES.find((r) => r.test.test(attr));
    const label = rule?.label ?? "Other";
    if (!buckets.has(label)) buckets.set(label, []);
    buckets.get(label)!.push(attr);
  }

  const order = [...GROUP_RULES.map((r) => r.label), "Other"];
  return order.filter((label) => buckets.has(label)).map((label) => ({ label, items: buckets.get(label)! }));
}
