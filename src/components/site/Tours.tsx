import { destinations } from "@/data/destinations";
import { placePhotos } from "@/data/places";
import { tourExamples } from "@/data/tours";
import { Reveal } from "./Reveal";

export function Tours() {
  return (
    <section id="tours" className="relative z-20 bg-[#ebe0cc] text-[#443A2C]">
      <div className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#315059]">Как может выглядеть день</p>
          <h2 className="mt-3 max-w-2xl font-heading text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-none">
            Программы <span className="italic text-[#b24d29]">для примера</span>
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#443A2C]/75">
            Это черновик подачи, не оферта. Цен, дат и гарантий здесь нет: стоимость и состав уточняются в заявке.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-20">
          {destinations.map((d, i) => {
            const example = tourExamples[d.id];
            const photos = placePhotos[d.id];
            const flip = i % 2 === 1;
            return (
              <article id={`tour-${d.id}`} key={d.id} className="scroll-mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                <Reveal className={flip ? "lg:order-2" : ""}>
                  <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(0,0.72fr)] gap-3">
                    <img src={photos[0].src} alt={photos[0].alt} className="aspect-[4/5] h-full w-full object-cover" loading="lazy" />
                    <div className="grid h-full min-h-0 grid-rows-2 gap-3">
                      <img src={photos[1].src} alt={photos[1].alt} className="h-full min-h-0 w-full object-cover" loading="lazy" />
                      <img src={photos[2].src} alt={photos[2].alt} className="h-full min-h-0 w-full object-cover" loading="lazy" />
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.06}>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#b24d29]">{d.kicker}</p>
                  <h3 className="mt-2 font-display text-5xl leading-none">{d.name}</h3>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#443A2C]/80">{d.blurb}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-[#443A2C]/45">Длительность</dt>
                      <dd className="mt-1">{example.days}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-[#443A2C]/45">Дорога</dt>
                      <dd className="mt-1">{d.flight}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-[#443A2C]/45">Формат</dt>
                      <dd className="mt-1">{example.format}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-[#443A2C]/45">Стоимость</dt>
                      <dd className="mt-1">По запросу</dd>
                    </div>
                  </dl>
                  <ol className="mt-6 space-y-2 text-sm text-[#443A2C]/80">
                    {example.program.map((step, stepIndex) => (
                      <li key={step} className="flex gap-3">
                        <span className="text-[#315059] tabular-nums">{String(stepIndex + 1).padStart(2, "0")}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 text-sm text-[#443A2C]/70">В примере: {example.included.join(", ")}.</p>
                  <a
                    href="#match"
                    className="mt-6 inline-flex border-b border-[#443A2C]/30 pb-0.5 text-sm hover:border-[#b24d29] hover:text-[#315059]"
                  >
                    Оставить заявку на {d.name}
                  </a>
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
