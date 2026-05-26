import { query } from "../db.js";

const BASE_SELECT = `
  SELECT
    sn.id              AS id,
    c.nombre           AS ciudad,
    sn.servicio_codigo AS codigo,
    sp.nombre          AS servicio,
    sn.precio_venta    AS precio,
    sn.active          AS active
  FROM omn_core_global.core_servicios_nacional sn
  INNER JOIN omn_core_global.core_ciudades_nacional      c  ON c.id = sn.ciudad_id
  LEFT  JOIN omn_core_global.core_servicios_sedes_propias sp ON sp.codigo = sn.servicio_codigo
`;

function normalizeRow(r) {
  return {
    id: r.id,
    ciudad: r.ciudad,
    codigo: r.codigo,
    servicio: r.servicio,
    precio: Number(r.precio),
    active: Number(r.active) === 1,
  };
}

export async function findAll({ ciudad, q, codigo, onlyActive = false, limit } = {}) {
  const where = [];
  const values = [];

  if (onlyActive) where.push("sn.active = 1");

  if (ciudad && ciudad !== "TODAS") {
    values.push(ciudad);
    where.push(`c.nombre = $${values.length}`);
  }

  if (codigo) {
    values.push(codigo);
    where.push(`sn.servicio_codigo = $${values.length}`);
  }

  if (q) {
    values.push(`%${q.toLowerCase()}%`);
    where.push(
      `(LOWER(sp.nombre) LIKE $${values.length} OR LOWER(sn.servicio_codigo) LIKE $${values.length})`
    );
  }

  let sql = BASE_SELECT;
  if (where.length) sql += `\n  WHERE ${where.join(" AND ")}`;
  sql += `\n  ORDER BY c.nombre, sp.nombre`;

  if (limit && Number.isFinite(limit) && limit > 0) {
    values.push(Math.min(Number(limit), 5000));
    sql += `\n  LIMIT $${values.length}`;
  }

  const { rows } = await query(sql, values);
  return rows.map(normalizeRow);
}

export async function updateActive(id, active) {
  const { rowCount } = await query(
    "UPDATE omn_core_global.core_servicios_nacional SET active = $1 WHERE id = $2",
    [active ? 1 : 0, id]
  );
  return rowCount > 0;
}

export async function findCiudades() {
  const { rows } = await query(
    `SELECT nombre FROM omn_core_global.core_ciudades_nacional ORDER BY nombre`
  );
  return rows.map((r) => r.nombre);
}

export async function countActive() {
  const { rows } = await query(
    `SELECT COUNT(*) AS total FROM omn_core_global.core_servicios_nacional WHERE active = 1`
  );
  return Number(rows[0]?.total || 0);
}
