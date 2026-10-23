import { placePhotos } from "@/data/places";
import { Reveal } from "./Reveal";

const canyon = placePhotos.sulak[0];
const walls = placePhotos.derbent[1];

export function Story() {
  return (
    <section id="philosophy" className="relative z-20 bg-[#ebe0cc] text-[#443A2C]">
      <div className="mx-auto grid max-w-[1480px] items-end gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-12 lg:py-28">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#315059]">Философия</p>
          <h2 className="mt-4 font-heading text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[0.96] text-balance">
            Дагестан, который хочется <span className="italic text-[#b24d29]">открыть</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#443A2C]/80">
            Мы выезжаем из Махачкалы и оставляем в дне место для дороги, людей и стола. Край должен открыться не открыткой, а местом, в котором хочется быть.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid grid-cols-[1.4fr_0.8fr] items-end gap-3 sm:gap-5">
          <figure className="overflow-hidden">
            <img
              src={canyon.src}
              alt={canyon.alt}
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <figure className="mb-8 overflow-hidden sm:mb-16">
            <img
              src={walls.src}
              alt={walls.alt}
              className="aspect-[3/4] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
