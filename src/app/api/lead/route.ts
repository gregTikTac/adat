import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80),
  contact: z
    .string()
    .trim()
    .min(5, "Укажите телефон или Telegram")
    .max(80),
  destination: z.string().trim().max(60).optional(),
  comment: z.string().trim().max(1000).optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    const fields = Object.fromEntries(
      parsed.error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]),
    );
    return Response.json({ ok: false, error: "Проверьте поля формы", fields }, { status: 422 });
  }

  const lead = { ...parsed.data, receivedAt: new Date().toISOString(), source: "hero-prototype" };

  // Point LEAD_WEBHOOK_URL at the CRM (amoCRM, Bitrix24, a Telegram bot relay, n8n...).
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`CRM responded with ${res.status}`);
    } catch (error) {
      console.error("[lead] CRM delivery failed", error);
      return Response.json({ ok: false, error: "Не удалось передать заявку. Попробуйте ещё раз." }, { status: 502 });
    }
  } else {
    console.info("[lead] received (no LEAD_WEBHOOK_URL set)", lead);
  }

  return Response.json({ ok: true });
}
