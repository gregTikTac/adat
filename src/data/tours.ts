import type { SceneId } from "@/data/destinations";

/**
 * Editorial stand-ins for the tour pages.
 * These are not a published offer: no prices, no dates, no guarantees.
 */
export type TourExample = {
  days: string;
  format: string;
  program: string[];
  included: string[];
};

export const tourExamples: Record<SceneId, TourExample> = {
  sulak: {
    days: "1 день",
    format: "Выезд из Махачкалы",
    program: ["Выезд утром", "Каньон и вода", "Бархан Сарыкум", "Возвращение к вечеру"],
    included: ["Трансфер", "Сопровождение"],
  },
  derbent: {
    days: "1 день",
    format: "Выезд из Махачкалы",
    program: ["Дорога на юг", "Цитадель и магалы", "Каспий у стен", "Возвращение"],
    included: ["Трансфер", "Сопровождение"],
  },
  gunib: {
    days: "1 день",
    format: "Выезд из Махачкалы",
    program: ["Серпантин на плато", "Гуниб", "Стол в ресторане «Адат»", "Обратная дорога"],
    included: ["Трансфер", "Сопровождение"],
  },
  khunzakh: {
    days: "1 день",
    format: "Выезд из Махачкалы",
    program: ["Дорога на плато", "Кромка и Тобот", "Матлас", "Возвращение"],
    included: ["Трансфер", "Сопровождение"],
  },
  goor: {
    days: "1 день",
    format: "Выезд из Махачкалы",
    program: ["Дорога в горы", "Башни Гоора", "Карадахская теснина", "Возвращение"],
    included: ["Трансфер", "Сопровождение"],
  },
};
