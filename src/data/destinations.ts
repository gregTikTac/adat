export type SceneId = "sulak" | "derbent" | "gunib" | "khunzakh" | "goor";

export type Destination = {
  id: SceneId;
  name: string;
  place: string;
  kicker: string;
  blurb: string;
  /** Local UTC offset in hours (MSK, no DST). */
  tz: number;
  lat: number;
  lon: number;
  /** Months (0 = January) that make up the best travel season. */
  bestMonths: number[];
  seasonLabel: string;
  /** Climatological fallback when Open-Meteo is unreachable. */
  fallback: { air: number; sea: number | null };
  /** Transfer time from Makhachkala, shown as «В пути». */
  flight: string;
};

const SEASON = [4, 5, 6, 7, 8, 9] as const;

/** Day-trip geography from Makhachkala / Kaspiysk. Scenes are remapped in stage 2. */
export const destinations: Destination[] = [
  {
    id: "sulak",
    name: "Сулак",
    place: "Дубки",
    kicker: "Каньон и бархан Сарыкум",
    blurb: "Самый глубокий каньон Европы, катер по бирюзовой воде и пески Сарыкума в одном дне из Махачкалы.",
    tz: 3,
    lat: 43.0236,
    lon: 46.8372,
    bestMonths: [...SEASON],
    seasonLabel: "май – октябрь",
    fallback: { air: 24, sea: 18 },
    flight: "≈ 1 ч 40 мин",
  },
  {
    id: "derbent",
    name: "Дербент",
    place: "Нарын-Кала",
    kicker: "Древнейший город России",
    blurb: "Цитадель ЮНЕСКО, магалы и Каспий у стен. Закат с крепости — тот самый час, ради которого едут на юг.",
    tz: 3,
    lat: 42.0541,
    lon: 48.2759,
    bestMonths: [...SEASON],
    seasonLabel: "май – октябрь",
    fallback: { air: 26, sea: 22 },
    flight: "≈ 2 ч",
  },
  {
    id: "gunib",
    name: "Гуниб",
    place: "Гуниб",
    kicker: "Плато, орлы и Салта",
    blurb: "Серпантин на плато, подземный Салтинский водопад и стол в нашем ресторане «Адат» с видом на ущелье.",
    tz: 3,
    lat: 42.3875,
    lon: 46.9614,
    bestMonths: [...SEASON],
    seasonLabel: "май – октябрь",
    fallback: { air: 18, sea: null },
    flight: "≈ 2 ч 50 мин",
  },
  {
    id: "khunzakh",
    name: "Хунзах",
    place: "Матлас",
    kicker: "Плато и водопад Тобот",
    blurb: "Край бездны, Тобот, Каменная чаша и ветер Матласа. День, который запоминается не городом, а горизонтом.",
    tz: 3,
    lat: 42.5449,
    lon: 46.7069,
    bestMonths: [...SEASON],
    seasonLabel: "май – октябрь",
    fallback: { air: 16, sea: null },
    flight: "≈ 3 ч",
  },
  {
    id: "goor",
    name: "Гоор",
    place: "Гоор",
    kicker: "Башни и «Язык тролля»",
    blurb: "Сторожевые башни на кромке обрыва, Карадахская теснина и аул-призрак Кахиб — фотография, которая не врёт.",
    tz: 3,
    lat: 42.4475,
    lon: 46.9058,
    bestMonths: [...SEASON],
    seasonLabel: "май – октябрь",
    fallback: { air: 17, sea: null },
    flight: "≈ 3 ч 20 мин",
  },
];

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
