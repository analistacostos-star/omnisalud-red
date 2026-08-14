import { useState, useMemo, useEffect } from "react";
import { fetchServicios, fetchServiciosSedes, fetchServiciosSedesPymes, fetchCiudades, updateServicioActive } from "../api/servicios.js";
import { HIDDEN_SEDES_CODES } from "../data/paquetes.js";
import { generarPdfCliente } from "../pdf/exportCliente.js";
import { normalize } from "../lib/format.js";

function applySort(items, sortAlpha, sortPrice) {
  if (sortAlpha) {
    items.sort((a, b) => sortAlpha === 1
      ? (a.servicio || "").localeCompare(b.servicio || "")
      : (b.servicio || "").localeCompare(a.servicio || "")
    );
  } else if (sortPrice) {
    items.sort((a, b) => sortPrice === 1
      ? a.precio - b.precio
      : b.precio - a.precio
    );
  }
  return items;
}

export function useServicios() {
  // ── Red Nacional (buscar) ──
  const [query, setQuery] = useState("");
  const [ciudad, setCiudad] = useState("TODAS");
  const [portafolio, setPortafolio] = useState([]);
  const [ciudades, setCiudades] = useState(["TODAS"]);
  const [loading, setLoading] = useState(true);

  // ── Ajustes ──
  const [adjQuery, setAdjQuery] = useState("");
  const [adjCiudad, setAdjCiudad] = useState("TODAS");
  const [onlyInactive, setOnlyInactive] = useState(false);

  // ── Particulares ──
  const [sedes, setSedes] = useState([]);
  const [sedesQuery, setSedesQuery] = useState("");
  const [sedesFilter, setSedesFilter] = useState("TODOS");
  const [cliente, setCliente] = useState({ nombre: "", documento: "", correo: "", telefono: "" });
  const [seleccionados, setSeleccionados] = useState(() => new Set());

  // ── Sedes Propias (pymes) ──
  const [pymes, setPymes] = useState([]);
  const [pymesQuery, setPymesQuery] = useState("");
  const [pymesFilter, setPymesFilter] = useState("TODOS");

  const [filterOpen, setFilterOpen] = useState(false);

  // Sorting: 0 = none/default, 1 = asc, 2 = desc
  const [sortAlpha, setSortAlpha] = useState(1);
  const [sortPrice, setSortPrice] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchServicios(), fetchCiudades(), fetchServiciosSedes(), fetchServiciosSedesPymes()])
      .then(([servs, ciuds, sedesData, pymesData]) => {
        if (cancelled) return;
        setPortafolio(servs);
        setCiudades(["TODAS", ...ciuds]);
        setSedes(sedesData);
        setPymes(pymesData);
      })
      .catch((err) => { if (!cancelled) console.error(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const toggleActive = async (id, currentStatus) => {
    try {
      const ok = await updateServicioActive(id, !currentStatus);
      if (ok) {
        setPortafolio(prev => prev.map(item => item.id === id ? { ...item, active: !currentStatus } : item));
      }
    } catch (err) {
      alert("Error al actualizar: " + err.message);
    }
  };

  const handleSortAlpha = () => {
    setSortPrice(0);
    setSortAlpha(prev => (prev === 1 ? 2 : 1));
  };

  const handleSortPrice = () => {
    setSortAlpha(0);
    setSortPrice(prev => (prev === 1 ? 2 : 1));
  };

  const closeFilter = () => setFilterOpen(false);
  const openFilter = () => setFilterOpen(true);

  const totalCiudades = useMemo(() => new Set(portafolio.map((r) => r.ciudad)).size, [portafolio]);
  const totalActivos = useMemo(() => portafolio.filter(r => r.active).length, [portafolio]);
  const totalInactivos = useMemo(() => portafolio.filter(r => !r.active).length, [portafolio]);

  const resultados = useMemo(() => {
    if (!query && ciudad === "TODAS") return [];
    let items = portafolio.filter(r => r.active).filter((r) => {
      const matchCiudad = ciudad === "TODAS" || r.ciudad === ciudad;
      const matchQuery = !query || normalize(r.servicio).includes(normalize(query)) || normalize(r.codigo).includes(normalize(query));
      return matchCiudad && matchQuery;
    });
    return applySort(items, sortAlpha, sortPrice).slice(0, 80);
  }, [query, ciudad, portafolio, sortAlpha, sortPrice]);

  const resultadosAdj = useMemo(() => {
    if (!adjQuery && adjCiudad === "TODAS" && !onlyInactive) return [];
    let items = portafolio.filter((r) => {
      const matchActive = onlyInactive ? !r.active : true;
      const matchCiudad = adjCiudad === "TODAS" || r.ciudad === adjCiudad;
      const matchQuery = !adjQuery || normalize(r.servicio || "").includes(normalize(adjQuery)) || normalize(r.codigo).includes(normalize(adjQuery));
      return matchActive && matchCiudad && matchQuery;
    });
    return applySort(items, sortAlpha, sortPrice).slice(0, 100);
  }, [adjQuery, adjCiudad, portafolio, sortAlpha, sortPrice, onlyInactive]);

  const resultadosSedes = useMemo(() => {
    let items = sedes.filter((r) => {
      if (HIDDEN_SEDES_CODES.has(r.codigo)) return false;
      const matchPaq = sedesFilter === "TODOS" || (r.codigo || "").toUpperCase().startsWith("PAQ");
      const matchQuery = !sedesQuery || normalize(r.servicio).includes(normalize(sedesQuery)) || normalize(r.codigo).includes(normalize(sedesQuery));
      return matchPaq && matchQuery;
    });
    return applySort(items, sortAlpha, sortPrice);
  }, [sedesQuery, sedesFilter, sedes, sortAlpha, sortPrice]);

  const resultadosPymes = useMemo(() => {
    let items = pymes.filter((r) => {
      const matchPaq = pymesFilter === "TODOS" || (r.codigo || "").toUpperCase().startsWith("PAQ");
      const matchQuery = !pymesQuery || normalize(r.servicio).includes(normalize(pymesQuery)) || normalize(r.codigo).includes(normalize(pymesQuery));
      return matchPaq && matchQuery;
    });
    return applySort(items, sortAlpha, sortPrice);
  }, [pymesQuery, pymesFilter, pymes, sortAlpha, sortPrice]);

  const nombrePorCodigo = useMemo(() => Object.fromEntries(sedes.map((r) => [r.codigo, r.servicio])), [sedes]);
  const sedesVisibles = useMemo(() => sedes.filter((r) => !HIDDEN_SEDES_CODES.has(r.codigo)), [sedes]);
  const totalSedes = sedesVisibles.length;
  const totalPaquetes = useMemo(() => sedesVisibles.filter((r) => (r.codigo || "").toUpperCase().startsWith("PAQ")).length, [sedesVisibles]);
  const totalPymes = pymes.length;
  const totalPymesPaquetes = useMemo(() => pymes.filter((r) => (r.codigo || "").toUpperCase().startsWith("PAQ")).length, [pymes]);

  const toggleSeleccion = (codigo) => setSeleccionados((prev) => {
    const next = new Set(prev);
    next.has(codigo) ? next.delete(codigo) : next.add(codigo);
    return next;
  });

  const clienteCompleto = ["nombre", "documento", "correo", "telefono"].every((k) => cliente[k].trim());
  const puedeExportar = clienteCompleto && seleccionados.size > 0;

  const exportarPdf = () => {
    if (!puedeExportar) return;
    const items = sedesVisibles.filter((r) => seleccionados.has(r.codigo));
    generarPdfCliente(cliente, items, nombrePorCodigo).catch((e) => {
      console.error(e);
      alert("No se pudo generar el PDF. Intente de nuevo.");
    });
  };

  return {
    query, setQuery, ciudad, setCiudad, portafolio, ciudades, loading,
    adjQuery, setAdjQuery, adjCiudad, setAdjCiudad, onlyInactive, setOnlyInactive,
    sedes, sedesQuery, setSedesQuery, sedesFilter, setSedesFilter,
    cliente, setCliente, seleccionados, toggleSeleccion, puedeExportar, clienteCompleto, exportarPdf,
    pymes, pymesQuery, setPymesQuery, pymesFilter, setPymesFilter,
    filterOpen, openFilter, closeFilter,
    sortAlpha, sortPrice, handleSortAlpha, handleSortPrice,
    resultados, resultadosAdj, resultadosSedes, resultadosPymes,
    nombrePorCodigo, totalSedes, totalPaquetes, totalPymes, totalPymesPaquetes,
    totalCiudades, totalActivos, totalInactivos, toggleActive,
  };
}
