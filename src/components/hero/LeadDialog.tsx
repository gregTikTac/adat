"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { destinations } from "@/data/destinations";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDestination: string;
};

type Status = "idle" | "sending" | "sent" | "error";

export function LeadDialog({ open, onOpenChange, defaultDestination }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [chosen, setChosen] = useState<string | null>(null);
  const destination = chosen ?? defaultDestination;

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setStatus("idle");
        setError(null);
        setFieldErrors({});
        setChosen(null);
      }, 250);
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);
    setFieldErrors({});
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          contact: form.get("contact"),
          comment: form.get("comment") || undefined,
          destination,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setFieldErrors(data.fields ?? {});
        setError(data.error ?? "Что-то пошло не так");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.");
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5 rounded-3xl border border-white/10 bg-[#0d111c]/95 p-6 text-white shadow-2xl ring-0 backdrop-blur-xl sm:max-w-md sm:p-8">
        {status === "sent" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-10 text-brand" strokeWidth={1.4} />
            <DialogTitle className="font-display text-3xl font-light">Заявка принята</DialogTitle>
            <DialogDescription className="text-white/65">
              Менеджер свяжется с вами в ближайшее время и предложит варианты под ваши даты и бюджет.
            </DialogDescription>
            <Button
              onClick={() => handleOpenChange(false)}
              className="mt-3 h-11 rounded-full bg-brand px-7 text-brand-ink hover:bg-brand/90"
            >
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="gap-2">
              <DialogTitle className="font-display text-4xl font-light leading-none">Подберём тур</DialogTitle>
              <DialogDescription className="text-white/65">
                Расскажите, куда хочется, и мы вернёмся с вариантами. Без обязательств.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="grid gap-4" noValidate>
              <fieldset className="grid gap-2">
                <legend className="mb-1 text-xs uppercase tracking-[0.18em] text-white/55">Направление</legend>
                <div className="flex flex-wrap gap-1.5">
                  {destinations.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      aria-pressed={destination === d.name}
                      onClick={() => setChosen(d.name)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                        destination === d.name
                          ? "border-brand bg-brand text-brand-ink"
                          : "border-white/20 text-white/75 hover:border-white/50"
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-1.5">
                <Label htmlFor="lead-name" className="text-white/80">
                  Имя
                </Label>
                <Input
                  id="lead-name"
                  name="name"
                  autoComplete="name"
                  required
                  aria-invalid={!!fieldErrors.name}
                  className="h-11 rounded-xl border-white/15 bg-white/5 px-3.5 text-white placeholder:text-white/35"
                  placeholder="Как к вам обращаться"
                />
                {fieldErrors.name && <p className="text-xs text-red-300">{fieldErrors.name}</p>}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="lead-contact" className="text-white/80">
                  Телефон или Telegram
                </Label>
                <Input
                  id="lead-contact"
                  name="contact"
                  autoComplete="tel"
                  required
                  aria-invalid={!!fieldErrors.contact}
                  className="h-11 rounded-xl border-white/15 bg-white/5 px-3.5 text-white placeholder:text-white/35"
                  placeholder="+7 900 000-00-00 или @username"
                />
                {fieldErrors.contact && <p className="text-xs text-red-300">{fieldErrors.contact}</p>}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="lead-comment" className="text-white/80">
                  Пожелания <span className="text-white/40">(необязательно)</span>
                </Label>
                <Textarea
                  id="lead-comment"
                  name="comment"
                  rows={3}
                  className="resize-none rounded-xl border-white/15 bg-white/5 px-3.5 py-2.5 text-white placeholder:text-white/35"
                  placeholder="Даты, состав, бюджет, что важно"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={status === "sending"}
                className="mt-1 h-12 rounded-full bg-brand text-base text-brand-ink hover:bg-brand/90"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="animate-spin" /> Отправляем
                  </>
                ) : (
                  "Отправить заявку"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
