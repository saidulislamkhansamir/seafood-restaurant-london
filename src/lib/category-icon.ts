const ICON_RULES: [RegExp, string][] = [
  [/oyster/i, "🦪"],
  [/crab/i, "🦀"],
  [/lobster/i, "🦞"],
  [/sushi/i, "🍣"],
  [/fish\s*&?\s*chips|fish and chips/i, "🍟"],
  [/prawn|shrimp/i, "🍤"],
  [/fish/i, "🐟"],
  [/seafood/i, "🦐"],
];

export function categoryIcon(category: string | null | undefined): string {
  if (!category) return "🍽️";
  for (const [pattern, icon] of ICON_RULES) {
    if (pattern.test(category)) return icon;
  }
  return "🍽️";
}

const GRADIENTS = [
  "from-primary to-primary-dark",
  "from-accent to-accent-dark",
  "from-primary-dark to-primary",
  "from-accent-dark to-accent",
];

export function categoryGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}
