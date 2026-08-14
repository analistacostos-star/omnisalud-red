const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function jsonOrThrow(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function fetchServicios(params = {}) {
  const qs = new URLSearchParams();
  if (params.ciudad && params.ciudad !== "TODAS") qs.set("ciudad", params.ciudad);
  if (params.q) qs.set("q", params.q);
  if (params.codigo) qs.set("codigo", params.codigo);
  if (params.onlyActive) qs.set("only_active", "1");
  if (params.limit) qs.set("limit", String(params.limit));

  const url = `${BASE}/servicios${qs.toString() ? `?${qs}` : ""}`;
  const json = await jsonOrThrow(await fetch(url));
  return json.data;
}

export async function fetchServiciosSedes() {
  const json = await jsonOrThrow(await fetch(`${BASE}/servicios-sedes`));
  return json.data;
}

export async function fetchServiciosSedesPymes() {
  const json = await jsonOrThrow(await fetch(`${BASE}/servicios-sedes-pymes`));
  return json.data;
}

export async function fetchCiudades() {
  const json = await jsonOrThrow(await fetch(`${BASE}/ciudades`));
  return json.data;
}

export async function updateServicioActive(id, active) {
  const url = `${BASE}/servicios/${id}/active`;
  const json = await jsonOrThrow(
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    })
  );
  return json.ok;
}
