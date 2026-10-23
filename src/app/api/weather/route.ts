import { destinations } from "@/data/destinations";

type Weather = { air: number; sea: number | null; live: boolean };

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const dest = destinations.find((d) => d.id === id);
  if (!dest) return Response.json({ error: "Unknown destination" }, { status: 404 });

  const fallback: Weather = { ...dest.fallback, live: false };
  const opts = { next: { revalidate: 900 }, signal: AbortSignal.timeout(5000) } as const;

  try {
    const air = fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${dest.lat}&longitude=${dest.lon}&current=temperature_2m`,
      opts,
    ).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))));
    const sea = fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${dest.lat}&longitude=${dest.lon}&current=sea_surface_temperature`,
      opts,
    )
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);

    const [a, s] = await Promise.all([air, sea]);
    const airTemp = a?.current?.temperature_2m;
    if (typeof airTemp !== "number") return Response.json(fallback);

    const seaTemp = s?.current?.sea_surface_temperature;
    const weather: Weather = {
      air: Math.round(airTemp),
      sea: typeof seaTemp === "number" ? Math.round(seaTemp) : null,
      live: true,
    };
    return Response.json(weather);
  } catch {
    return Response.json(fallback);
  }
}
