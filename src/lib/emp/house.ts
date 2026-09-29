export const HOUSE = {
  name: "EMP Exclusive",
  acronym: "EMPIRE",
  formerName: "ECHELON EMP",
  founded: "19 December 2024",
  foundedShort: "19 Dec 2024",
  city: "Francistown",
  country: "Botswana",
  tagline: "EMP · Francistown, Botswana",
  disciplines: "Music · Fashion · Media · House",
  subscribeWeight: 19,
  storyLifeMs: 24 * 60 * 60 * 1000,
} as const;

export function isLiveStory(createdAt: string) {
  const stamp = new Date(createdAt).getTime();
  if (Number.isNaN(stamp)) return false;
  return Date.now() - stamp < HOUSE.storyLifeMs;
}

export function memberInitials(name: string) {
  const parts = name.split(/[\s.\-]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
  return parts
    .slice(0, 3)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
