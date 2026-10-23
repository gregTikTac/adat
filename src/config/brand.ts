/**
 * Brand tokens live here and in the `--brand-*` variables in `src/app/globals.css`.
 * Source: brand book «АДАТ версия 5» — tour-operator line, not the restaurant.
 */
export const brand = {
  name: "АДАТ",
  descriptor: "Туроператор гостеприимства",
  phone: "8 800 511-41-80",
  phoneHref: "tel:+78005114180",
  nav: [
    { label: "Маршруты", href: "#destinations" },
    { label: "Туры", href: "#tours" },
    { label: "О компании", href: "#about" },
    { label: "Контакты", href: "#contacts" },
  ],
  hero: {
    eyebrow: "Экскурсии и туры по Дагестану",
    headline: ["Исследователи", "традиций"],
    lead: "Встречаем в Махачкале и ведём по каньонам, крепостям и аулам. Свет, сезон и темп дня подбираем так, чтобы край открылся не открыткой, а местом, в котором хочется быть.",
    cta: "Подобрать тур",
    secondaryCta: "Все маршруты",
  },
  origin: { name: "Махачкала", lat: 42.9849, lon: 47.5047 },
} as const;
