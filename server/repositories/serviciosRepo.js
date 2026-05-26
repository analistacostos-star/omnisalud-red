import { pool } from "../db.js";

const BASE_SELECT = `
  SELECT
    sn.id           AS id,
    c.nombre        AS ciudad,
    sn.servicio_codigo AS codigo,
    sp.nombre       AS servicio,
    sn.precio_venta AS precio,
    sn.active       AS active
  FROM omn_core_global.core_servicios_nacional sn
  INNER JOIN omn_core_global.core_ciudades_nacional       c  ON c.id = sn.ciudad_id
  LEFT JOIN omn_core_global.core_servicios_sedes_propias sp ON sp.codigo = sn.servicio_codigo
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
  const params = {};

  if (onlyActive) where.push("sn.active = 1");
  if (ciudad && ciudad !== "TODAS") {
    where.push("c.nombre = :ciudad");
    params.ciudad = ciudad;
  }
  if (codigo) {
    where.push("sn.servicio_codigo = :codigo");
    params.codigo = codigo;
  }
  if (q) {
    where.push("(sp.nombre LIKE :q OR sn.servicio_codigo LIKE :q)");
    params.q = `%${q}%`;
  }

  let sql = BASE_SELECT;
  if (where.length) sql += `\n  WHERE ${where.join(" AND ")}`;
  sql += `\n  ORDER BY c.nombre, sp.nombre`;
  if (limit && Number.isFinite(limit) && limit > 0) {
    sql += `\n  LIMIT :limit`;
    params.limit = Math.min(Number(limit), 5000);
  }

  const [rows] = await pool.execute(sql, params);
  return rows.map(normalizeRow);
}

export async function updateActive(id, active) {
  const [result] = await pool.execute(
    "UPDATE omn_core_global.core_servicios_nacional SET active = :active WHERE id = :id",
    { id, active: active ? 1 : 0 }
  );
  return result.affectedRows > 0;
}

export async function findCiudades() {
  const [rows] = await pool.execute(
    `SELECT nombre FROM omn_core_global.core_ciudades_nacional ORDER BY nombre`
  );
  return rows.map((r) => r.nombre);
}

export async function countActive() {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM omn_core_global.core_servicios_nacional WHERE active = 1`
  );
  return Number(rows[0]?.total || 0);
}
