import { brand } from "@/config/brand";

export function Contacts() {
  return (
    <footer id="contacts" className="relative z-20 bg-[#ebe0cc] text-[#443A2C]">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-10 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-28">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#315059]">Контакты</p>
          <h2 className="mt-4 font-heading text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-none">
            Начнём с <span className="italic text-[#b24d29]">разговора</span>
          </h2>
          <a href="#match" className="mt-8 inline-flex h-12 items-center rounded-full bg-brand px-7 text-[15px] font-medium text-brand-ink hover:bg-white">
            Подобрать тур
          </a>
        </div>
        <address className="not-italic text-sm leading-relaxed text-[#443A2C]/80">
          <a href={brand.phoneHref} className="font-display text-3xl text-[#315059] hover:text-[#b24d29]">
            {brand.phone}
          </a>
          <p className="mt-3">{brand.address}</p>
          <a href={brand.site} className="mt-1 inline-block border-b border-[#443A2C]/30 hover:border-[#b24d29]">
            {brand.siteLabel}
          </a>
          <p className="mt-4 max-w-xs text-[#443A2C]/55">Мессенджеры добавим, когда будут рабочие номера. Сейчас связь — по телефону.</p>
        </address>
      </div>
    </footer>
  );
}
