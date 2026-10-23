/**
 * Everything brand-specific lives here and in the `--brand-*` variables
 * in `src/app/globals.css`. Swap these when the brand book arrives.
 */
export const brand = {
  name: "MERIDIAN",
  descriptor: "Авторские путешествия",
  phone: "+7 (900) 000-00-00",
  phoneHref: "tel:+79000000000",
  nav: [
    { label: "Направления", href: "#destinations" },
    { label: "Туры", href: "#tours" },
    { label: "О компании", href: "#about" },
    { label: "Контакты", href: "#contacts" },
  ],
  hero: {
    eyebrow: "Туроператор премиальных путешествий",
    headline: ["Лучший свет", "в каждой точке мира"],
    lead: "Подбираем направление, сезон и даже час света, чтобы поездка выглядела так, как вы её себе представляли.",
    cta: "Подобрать тур",
    secondaryCta: "Все направления",
  },
  origin: { name: "Москва", lat: 55.7558, lon: 37.6173 },
} as const;
