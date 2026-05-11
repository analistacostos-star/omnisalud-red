import { Router } from "express";
import * as repo from "../repositories/serviciosRepo.js";

const router = Router();

router.get("/servicios", async (req, res, next) => {
  try {
    const { ciudad, q, codigo, only_active, limit } = req.query;
    const data = await repo.findAll({
      ciudad,
      q,
      codigo,
      onlyActive: only_active === "1" || only_active === "true",
      limit: limit ? Number(limit) : undefined,
    });
    res.json({ data, count: data.length });
  } catch (err) {
    next(err);
  }
});

router.get("/ciudades", async (_req, res, next) => {
  try {
    const data = await repo.findCiudades();
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/health", async (_req, res, next) => {
  try {
    const total = await repo.countActive();
    res.json({ ok: true, total_active: total });
  } catch (err) {
    next(err);
  }
});

router.patch("/servicios/:id/active", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const ok = await repo.updateActive(id, active);
    res.json({ ok });
  } catch (err) {
    next(err);
  }
});

export default router;
