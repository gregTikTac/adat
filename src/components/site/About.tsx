import { placePhotos } from "@/data/places";
import { AnimatedHeading } from "./AnimatedHeading";
import { Reveal } from "./Reveal";
import { ParallaxImage } from "./ParallaxImage";

export function About() {
  const tower = placePhotos.goor[0];
  return (
    <section id="about" className="relative z-20 bg-[#315059] text-[#ebe0cc]">
      <div className="mx-auto grid max-w-[1480px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-28">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-[#f7ce5e]">О компании</p>
          <AnimatedHeading
            as="h2"
            parts={["Гостеприимство как ", { text: "маршрут", className: "italic text-[#f7ce5e]" }]}
            className="mt-4 font-heading text-[clamp(2.2rem,4.6vw,4.2rem)] font-light leading-[0.98]"
          />
          <div className="mt-6 max-w-xl space-y-4 text-[15px] leading-relaxed text-[#ebe0cc]/80">
            <p>
              АДАТ собирает поездку из Махачкалы: каньон, крепость, плато, башни. Темп дня подбираем так, чтобы осталось время поговорить и сесть за стол.
            </p>
            <p>
              Ресторан «Адат» в Гунибе — часть этого гостеприимства, а не отдельная история. Туда попадаешь с маршрута, с видом на ущелье.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ParallaxImage src={tower.src} alt={tower.alt} className="aspect-[4/5] w-full" />
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#ebe0cc]/55">Гоор, сторожевые башни</p>
        </Reveal>
      </div>
    </section>
  );
}
