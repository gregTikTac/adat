import type { SceneId } from "@/data/destinations";

export type PlacePhoto = { src: string; alt: string };

/** Curated frames from brand/<place>. Shown under the hero, not instead of it. */
export const placePhotos: Record<SceneId, PlacePhoto[]> = {
  sulak: [
    { src: "/places/sulak/canyon.jpg", alt: "Сулакский каньон с бирюзовой водой" },
    { src: "/places/sulak/water.jpg", alt: "Бирюзовая вода у стены каньона" },
    { src: "/places/sulak/shore.jpg", alt: "Берег Сулака" },
  ],
  derbent: [
    { src: "/places/derbent/citadel.jpg", alt: "Стены цитадели Нарын-Кала" },
    { src: "/places/derbent/walls.jpg", alt: "Крепостная стена над Дербентом" },
    { src: "/places/derbent/gate.jpg", alt: "Каменные ворота крепости" },
  ],
  gunib: [
    { src: "/places/gunib/terrace.jpg", alt: "Терраса с видом на ущелье Гуниба" },
    { src: "/places/gunib/ridge.jpg", alt: "Хребты вокруг Гуниба" },
    { src: "/places/gunib/evening.jpg", alt: "Гуниб вечером" },
  ],
  khunzakh: [
    { src: "/places/khunzakh/tobot.jpg", alt: "Водопад Тобот на кромке плато" },
    { src: "/places/khunzakh/fall.jpg", alt: "Тобот с обрыва" },
    { src: "/places/khunzakh/plateau.jpg", alt: "Хунзахское плато" },
  ],
  goor: [
    { src: "/places/goor/cliff.jpg", alt: "Башни Гоора на скале" },
    { src: "/places/goor/towers.jpg", alt: "Сторожевые башни аула" },
    { src: "/places/goor/path.jpg", alt: "Тропа у башен" },
  ],
};
