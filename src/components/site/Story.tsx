import { placePhotos } from "@/data/places";
import { AnimatedHeading } from "./AnimatedHeading";
import { Reveal } from "./Reveal";
import { ParallaxImage } from "./ParallaxImage";

const canyon = placePhotos.sulak[0];
const walls = placePhotos.derbent[1];

export function Story() {
  return (
    <section id="philosophy" className="relative z-20 bg-[#ebe0cc] text-[#443A2C]">
      <div className="mx-auto grid max-w-[1480px] items-end gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-12 lg:py-28">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-[#315059]">Философия</p>
          <AnimatedHeading
            as="h2"
            parts={["Дагестан, который хочется ", { text: "открыть", className: "italic text-[#b24d29]" }]}
            className="mt-4 font-heading text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[0.96]"
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#443A2C]/80">
            Мы выезжаем из Махачкалы и оставляем в дне место для дороги, людей и стола. Край должен открыться не открыткой, а местом, в котором хочется быть.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid grid-cols-2 gap-3 sm:gap-5">
          <figure className="overflow-hidden">
            <ParallaxImage src={canyon.src} alt={canyon.alt} className="aspect-[4/5] w-full" />
          </figure>
          <figure className="overflow-hidden">
            <ParallaxImage src={walls.src} alt={walls.alt} className="aspect-[4/5] w-full" />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
