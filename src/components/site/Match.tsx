"use client";

import { useMemo, useState } from "react";
import { destinations, type SceneId } from "@/data/destinations";
import { Button } from "@/components/ui/button";
import { AnimatedHeading } from "./AnimatedHeading";
import { Reveal } from "./Reveal";

const interests: { id: string; label: string; places: SceneId[] }[] = [
  { id: "water", label: "Каньон и вода", places: ["sulak"] },
  { id: "city", label: "Город и крепость", places: ["derbent"] },
  { id: "table", label: "Плато и стол", places: ["gunib", "khunzakh"] },
  { id: "towers", label: "Башни и аулы", places: ["goor"] },
];

const lengths = [
  { id: "day", label: "Один день" },
  { id: "weekend", label: "2–3 дня" },
  { id: "longer", label: "4–5 дней" },
];

const formats = [
  { id: "group", label: "Небольшая группа" },
  { id: "private", label: "Индивидуально" },
  { id: "family", label: "С семьёй" },
];

function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`border px-4 py-2.5 text-sm transition-all duration-200 hover:scale-[1.02] ${
        pressed ? "border-[#315059] bg-[#315059] text-[#ebe0cc]" : "border-[#443A2C]/25 text-[#443A2C] hover:border-[#315059]"
      }`}
    >
      {children}
    </button>
  );
}

export function Match() {
  const [picked, setPicked] = useState<string[]>(["water"]);
  const [length, setLength] = useState("day");
  const [format, setFormat] = useState("group");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const matches = useMemo(() => {
    const ids = new Set(interests.filter((item) => picked.includes(item.id)).flatMap((item) => item.places));
    const list = destinations.filter((d) => ids.has(d.id));
    return list.length ? list : destinations;
  }, [picked]);

  function toggle(id: string) {
    setPicked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const lengthLabel = lengths.find((item) => item.id === length)?.label;
    const formatLabel = formats.find((item) => item.id === format)?.label;
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          destination: matches.map((d) => d.name).join(", "),
          comment: `Пример подбора. Интересы: ${picked.join(", ") || "не выбраны"}. Длительность: ${lengthLabel}. Формат: ${formatLabel}.`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Не удалось записать заявку");
        setStatus("error");
        return;
      }
      setStatus("saved");
    } catch {
      setError("Нет связи с сервером.");
      setStatus("error");
    }
  }

  return (
    <section id="match" className="relative z-20 bg-[#f3eadc] text-[#443A2C]">
      <div className="mx-auto grid max-w-[1480px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-28">
        <Reveal>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#315059]">Подбор</p>
            <AnimatedHeading
              as="h2"
              parts={["Куда ехать ", { text: "сначала", className: "italic text-[#b24d29]" }]}
              className="mt-4 font-heading text-[clamp(2.2rem,4.4vw,3.8rem)] font-light leading-none"
            />
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#443A2C]/75">
              Выберите интерес. Справа появятся направления из этой страницы. Заявка записывается в прототип и не уходит менеджеру, пока не подключена CRM.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <form onSubmit={submit} className="grid gap-8">
          <fieldset>
            <legend className="text-xs uppercase tracking-[0.2em] text-[#443A2C]/50">Интерес</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {interests.map((item) => (
                <Chip key={item.id} pressed={picked.includes(item.id)} onClick={() => toggle(item.id)}>
                  {item.label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-xs uppercase tracking-[0.2em] text-[#443A2C]/50">Длительность</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {lengths.map((item) => (
                <Chip key={item.id} pressed={length === item.id} onClick={() => setLength(item.id)}>
                  {item.label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-xs uppercase tracking-[0.2em] text-[#443A2C]/50">Формат</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {formats.map((item) => (
                <Chip key={item.id} pressed={format === item.id} onClick={() => setFormat(item.id)}>
                  {item.label}
                </Chip>
              ))}
            </div>
          </fieldset>

          <div className="border-t border-[#443A2C]/15 pt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#b24d29]">Подходит</p>
            <ul className="mt-4 divide-y divide-[#443A2C]/15">
              {matches.map((d) => (
                <li key={d.id} className="flex items-baseline justify-between gap-4 py-3">
                  <a href={`#tour-${d.id}`} className="font-display text-3xl leading-none hover:text-[#315059]">
                    {d.name}
                  </a>
                  <span className="text-sm text-[#443A2C]/60">{d.flight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm">
              Имя
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="h-11 border border-[#443A2C]/20 bg-transparent px-3 outline-none focus:border-[#315059]"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              Телефон или Telegram
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                autoComplete="tel"
                className="h-11 border border-[#443A2C]/20 bg-transparent px-3 outline-none focus:border-[#315059]"
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="text-sm text-[#b24d29]">
              {error}
            </p>
          )}
          {status === "saved" ? (
            <p className="text-sm leading-relaxed text-[#315059]">
              Заявка записана на сервере прототипа. Менеджер её не получит, пока не указан адрес CRM. Позвонить можно по номеру внизу страницы.
            </p>
          ) : (
            <Button type="submit" disabled={status === "sending"} className="h-12 w-fit rounded-full bg-brand px-7 text-brand-ink hover:bg-white">
              {status === "sending" ? "Записываем" : "Записать заявку"}
            </Button>
          )}
        </form>
      </Reveal>
      </div>
    </section>
  );
}
