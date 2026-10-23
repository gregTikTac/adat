export type SceneId = "maldives" | "dubai" | "bali" | "istanbul" | "phuket";

export type Destination = {
  id: SceneId;
  name: string;
  place: string;
  kicker: string;
  blurb: string;
  /** Local UTC offset in hours (none of these places observe DST). */
  tz: number;
  lat: number;
  lon: number;
  /** Months (0 = January) that make up the best travel season. */
  bestMonths: number[];
  seasonLabel: string;
  /** Rough climatological values, used only when the weather API is unreachable. */
  fallback: { air: number; sea: number | null };
  flight: string;
};

/** Placeholder content: replace with real offers from the CRM / client. */
export const destinations: Destination[] = [
  {
    id: "maldives",
    name: "Мальдивы",
    place: "Мале",
    kicker: "Атоллы Индийского океана",
    blurb: "Виллы на воде, тихие лагуны и закаты без единого лишнего звука.",
    tz: 5,
    lat: 4.1755,
    lon: 73.5093,
    bestMonths: [10, 11, 0, 1, 2, 3],
    seasonLabel: "ноябрь – апрель",
    fallback: { air: 30, sea: 29 },
    flight: "≈ 8 ч 30 мин",
  },
  {
    id: "dubai",
    name: "Дубай",
    place: "Дубай",
    kicker: "Эмираты",
    blurb: "Небоскрёбы над заливом, пустыня в получасе езды и сервис без компромиссов.",
    tz: 4,
    lat: 25.2048,
    lon: 55.2708,
    bestMonths: [9, 10, 11, 0, 1, 2, 3],
    seasonLabel: "октябрь – апрель",
    fallback: { air: 33, sea: 29 },
    flight: "≈ 5 ч 15 мин",
  },
  {
    id: "bali",
    name: "Бали",
    place: "Убуд",
    kicker: "Остров богов",
    blurb: "Рисовые террасы, вулканы на горизонте и утро, которое начинается в тумане.",
    tz: 8,
    lat: -8.5069,
    lon: 115.2625,
    bestMonths: [3, 4, 5, 6, 7, 8, 9],
    seasonLabel: "апрель – октябрь",
    fallback: { air: 29, sea: 28 },
    flight: "≈ 12 ч с пересадкой",
  },
  {
    id: "istanbul",
    name: "Стамбул",
    place: "Стамбул",
    kicker: "Город на двух континентах",
    blurb: "Минареты на закате, паромы над Босфором и кофе, который не торопит.",
    tz: 3,
    lat: 41.0082,
    lon: 28.9784,
    bestMonths: [3, 4, 5, 8, 9, 10],
    seasonLabel: "апрель – июнь, сентябрь – ноябрь",
    fallback: { air: 18, sea: null },
    flight: "≈ 3 ч 15 мин",
  },
  {
    id: "phuket",
    name: "Пхукет",
    place: "Пхукет",
    kicker: "Андаманское море",
    blurb: "Известняковые скалы из воды, лодки с длинным хвостом и тёплое море круглый год.",
    tz: 7,
    lat: 7.8804,
    lon: 98.3923,
    bestMonths: [10, 11, 0, 1, 2, 3],
    seasonLabel: "ноябрь – апрель",
    fallback: { air: 31, sea: 29 },
    flight: "≈ 9 ч 30 мин",
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
