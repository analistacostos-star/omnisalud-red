import { useState, useMemo, useRef, useEffect } from "react";
import { LOGO_B64 } from "./data/logo.js";
import { fetchServicios, fetchServiciosSedes, fetchCiudades, updateServicioActive } from "./api/servicios.js";

const normalize = (str) =>
  (str || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const formatPrecio = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

// --- Solid Flaticon-inspired SVG Components ---
const IconSearch = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M10 2a8 8 0 0 1 6.32 12.9l4.38 4.39a1 1 0 0 1-1.41 1.42l-4.39-4.38A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
  </svg>
);

const IconLocation = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const IconSortAZ = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M7.5 3L11 7H4L7.5 3zM7.5 21L4 17h7l-3.5 4zM15 5h7v2h-7V5zm0 6h7v2h-7v-2zm0 6h7v2h-7v-2z" />
  </svg>
);

const IconSortPrice = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M11.5 3L15 7H8L11.5 3zm0 18L8 17h7l-3.5 4zM2 9h4v2H2V9zm0 4h7v2H2v-2zm16-4h4v2h-4V9zm-3 4h7v2h-7v-2z" />
  </svg>
);

const IconSettings = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.59-.22l-2.39.81c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.41h-3.84a.5.5 0 0 0-.5.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.81a.5.5 0 0 0-.59.22L2.74 8.87a.5.5 0 0 0 .12.64l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.12.22.4.29.59.22l2.39-.81c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.27.41.5.41h3.84c.24 0 .44-.17.5-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.81c.2.07.48 0 .59-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
  </svg>
);

const IconConsult = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const IconPackage = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.31L5.5 8 12 11.69 18.5 8 12 4.31zM5 9.72v6.1l6 3.33v-6.1L5 9.72zm14 0l-6 3.33v6.1l6-3.33v-6.1z" />
  </svg>
);

const IconEye = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const IconEyeOff = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.74-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
  </svg>
);

const IconHamburger = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
  </svg>
);

const IconClose = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const IconFilter = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
  </svg>
);

function ClearBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 6px", color: "#6b7a99", fontSize: 20, lineHeight: 1, display: "flex", alignItems: "center" }}>
      ×
    </button>
  );
}

function ServiceCard({ item, query }) {
  const highlight = (text) => {
    if (!query) return text;
    const idx = normalize(text).indexOf(normalize(query));
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark>{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 10, padding: "12px 16px", marginBottom: 8,
      boxShadow: "0 1px 3px rgba(10,40,90,0.05)",
      border: "1px solid #eef1f6", borderLeft: "4px solid #1aab8a",
      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0c2d6b", lineHeight: 1.2, marginBottom: 4 }}>
          {highlight(item.servicio || item.codigo)}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1aab8a", background: "#e8faf5", borderRadius: 4, padding: "1px 6px", textTransform: "uppercase" }}>
            {item.codigo}
          </span>
          {item.ciudad && (
            <span style={{ fontSize: 11, fontWeight: 500, color: "#6b7a99", display: "flex", alignItems: "center", gap: 4 }}>
              <IconLocation size={12} color="#94a3b8" /> {item.ciudad}
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#0c2d6b", letterSpacing: "-0.01em" }}>
          {formatPrecio(item.precio)}
        </div>
      </div>
    </div>
  );
}

// --- Stat Badge (reusable) ---
function StatBadge({ label, value, color, variant }) {
  const isRed = variant === "red";
  return (
    <div className="badge-touch" style={{
      background: isRed ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.1)",
      padding: "clamp(3px, 1vw, 5px) clamp(6px, 2vw, 10px)", borderRadius: 8,
      border: `1px solid ${isRed ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.12)"}`,
      textAlign: "right",
    }}>
      <div style={{ fontSize: "clamp(7px, 2vw, 9px)", fontWeight: 700, color: isRed ? "#ef4444" : "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 1 }}>
        {label}
      </div>
      <div style={{ fontSize: "clamp(12px, 3.5vw, 14px)", fontWeight: 800, color: isRed ? "#ef4444" : (color || "#fff") }}>{value}</div>
    </div>
  );
}

function SortControls({ handleSortAlpha, handleSortPrice, sortAlpha, sortPrice, onlyInactive, setOnlyInactive, vertical }) {
  return (
    <div style={{ display: "flex", gap: 8, flexDirection: vertical ? "column" : "row" }}>
      <button onClick={handleSortAlpha} className={`filter-btn ${sortAlpha ? "active" : ""}`} style={vertical ? { width: "100%", justifyContent: "center" } : {}}>
        <IconSortAZ size={16} /> {sortAlpha === 2 ? "Z-A" : "A-Z"}
      </button>
      <button onClick={handleSortPrice} className={`filter-btn ${sortPrice ? "active" : ""}`} style={vertical ? { width: "100%", justifyContent: "center" } : {}}>
        <IconSortPrice size={16} /> {sortPrice === 2 ? "Mayor" : "Menor"}
      </button>
      {setOnlyInactive && (
        <button onClick={() => setOnlyInactive(!onlyInactive)} className={`filter-btn ${onlyInactive ? "active" : ""}`}
          style={{
            ...(vertical ? { width: "100%", justifyContent: "center" } : {}),
            color: onlyInactive ? "#ef4444" : "#6b7a99",
            borderColor: onlyInactive ? "#ef4444" : "#eef1f6",
            background: onlyInactive ? "#fef2f2" : "#fff",
          }}>
          {onlyInactive ? <IconEyeOff size={18} color="#ef4444" /> : <IconEye size={18} color="#6b7a99" />}
        </button>
      )}
    </div>
  );
}

function CitySelect({ value, onChange, ciudades }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex", zIndex: 1 }}>
        <IconLocation size={14} color="#94a3b8" />
      </span>
      <select value={value} onChange={onChange} style={{
        width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 38px",
        borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, fontWeight: 600,
        appearance: "none", background: "#f8fafc", color: "#0c2d6b", cursor: "pointer",
      }}>
        {ciudades.map((c) => (<option key={c} value={c}>{c === "TODAS" ? "Todas las ciudades" : c}</option>))}
      </select>
    </div>
  );
}

function PaqSelect({ value, onChange }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex", zIndex: 1 }}>
        <IconFilter size={14} color="#94a3b8" />
      </span>
      <select value={value} onChange={onChange} style={{
        width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 38px",
        borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, fontWeight: 600,
        appearance: "none", background: "#f8fafc", color: "#0c2d6b", cursor: "pointer",
      }}>
        <option value="TODOS">Todos los servicios</option>
        <option value="PAQ">Solo Paquetes</option>
      </select>
    </div>
  );
}

export default function App() {
  const [rol, setRol] = useState("cliente");
  const [query, setQuery] = useState("");
  const [ciudad, setCiudad] = useState("TODAS");
  const [portafolio, setPortafolio] = useState([]);
  const [ciudades, setCiudades] = useState(["TODAS"]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [tab, setTab] = useState("buscar");
  const [adjQuery, setAdjQuery] = useState("");
  const [adjCiudad, setAdjCiudad] = useState("TODAS");
  const [sedes, setSedes] = useState([]);
  const [sedesQuery, setSedesQuery] = useState("");
  const [sedesFilter, setSedesFilter] = useState("TODOS");
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Sorting States: 0 = none/default, 1 = asc, 2 = desc
  const [sortAlpha, setSortAlpha] = useState(1);
  const [sortPrice, setSortPrice] = useState(0);
  const [onlyInactive, setOnlyInactive] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);
  const [sedesUnlocked, setSedesUnlocked] = useState(false);

  const inputRef = useRef(null);
  const adjInputRef = useRef(null);
  const sedesInputRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (rol === "admin" && tab === "buscar") setTab("ajustes");
    if (rol === "cliente" && tab === "ajustes") setTab("buscar");
  }, [rol]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    Promise.all([fetchServicios(), fetchCiudades(), fetchServiciosSedes()])
      .then(([servs, ciuds, sedesData]) => {
        if (cancelled) return;
        setPortafolio(servs);
        setCiudades(["TODAS", ...ciuds]);
        setSedes(sedesData);
      })
      .catch((err) => { if (!cancelled) setLoadError(err.message || "Error de conexión"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (showPasswordModal) {
      setTimeout(() => passwordRef.current?.focus(), 100);
    }
  }, [showPasswordModal]);

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

  const closeMenu = () => setMenuOpen(false);
  const closeFilter = () => setFilterOpen(false);

  const totalCiudades = useMemo(() => new Set(portafolio.map((r) => r.ciudad)).size, [portafolio]);
  const totalActivos = useMemo(() => portafolio.filter(r => r.active).length, [portafolio]);
  const totalInactivos = useMemo(() => portafolio.filter(r => !r.active).length, [portafolio]);

  const applySort = (items) => {
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
  };

  const resultados = useMemo(() => {
    if (!query && ciudad === "TODAS") return [];
    let items = portafolio.filter(r => r.active).filter((r) => {
      const matchCiudad = ciudad === "TODAS" || r.ciudad === ciudad;
      const matchQuery = !query || normalize(r.servicio).includes(normalize(query)) || normalize(r.codigo).includes(normalize(query));
      return matchCiudad && matchQuery;
    });
    return applySort(items).slice(0, 80);
  }, [query, ciudad, portafolio, sortAlpha, sortPrice]);

  const resultadosAdj = useMemo(() => {
    if (!adjQuery && adjCiudad === "TODAS" && !onlyInactive) return [];
    let items = portafolio.filter((r) => {
      const matchActive = onlyInactive ? !r.active : true;
      const matchCiudad = adjCiudad === "TODAS" || r.ciudad === adjCiudad;
      const matchQuery = !adjQuery || normalize(r.servicio || "").includes(normalize(adjQuery)) || normalize(r.codigo).includes(normalize(adjQuery));
      return matchActive && matchCiudad && matchQuery;
    });
    return applySort(items).slice(0, 100);
  }, [adjQuery, adjCiudad, portafolio, sortAlpha, sortPrice, onlyInactive]);

  const resultadosSedes = useMemo(() => {
    let items = sedes.filter((r) => {
      const matchPaq = sedesFilter === "TODOS" || (r.codigo || "").toUpperCase().startsWith("PAQ");
      const matchQuery = !sedesQuery || normalize(r.servicio).includes(normalize(sedesQuery)) || normalize(r.codigo).includes(normalize(sedesQuery));
      return matchPaq && matchQuery;
    });
    return applySort(items);
  }, [sedesQuery, sedesFilter, sedes, sortAlpha, sortPrice]);

  const totalSedes = sedes.length;
  const totalPaquetes = useMemo(() => sedes.filter((r) => (r.codigo || "").toUpperCase().startsWith("PAQ")).length, [sedes]);

  const servicesInCity = useMemo(() => {
    const currentCiudad = tab === "buscar" ? ciudad : adjCiudad;
    const activePortafolio = portafolio.filter(r => r.active);
    if (currentCiudad === "TODAS") return activePortafolio.length;
    return activePortafolio.filter(r => r.ciudad === currentCiudad).length;
  }, [portafolio, ciudad, adjCiudad, tab]);

  const tabsDef = [
    ["buscar", <><IconConsult size={16} /> Consultar</>],
    ["sedes", <><IconPackage size={16} /> Particulares</>],
    ["ajustes", <><IconSettings size={16} /> Ajustes</>],
  ];

  const switchTab = (key) => {
    if (key === "ajustes" && rol !== "admin") {
      setPendingTab("ajustes");
      setShowPasswordModal(true);
      return;
    }
    if (key === "sedes" && !sedesUnlocked) {
      setPendingTab("sedes");
      setShowPasswordModal(true);
      return;
    }
    setTab(key);
    setRol(key === "ajustes" ? "admin" : "cliente");
    setMenuOpen(false);
  };

  const PASSWORDS = { ajustes: "Costos2026*", sedes: "Omni2026-*" };
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === PASSWORDS[pendingTab]) {
      setShowPasswordModal(false);
      setPasswordInput("");
      setPasswordError(false);
      if (pendingTab === "sedes") {
        setSedesUnlocked(true);
        setTab("sedes");
        setRol("cliente");
      } else {
        setTab("ajustes");
        setRol("admin");
      }
      setMenuOpen(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
      passwordRef.current?.focus();
    }
  };

  const currentCiudadLabel = tab === "buscar"
    ? (ciudad === "TODAS" ? "Red" : ciudad)
    : (adjCiudad === "TODAS" ? "Red" : adjCiudad);

  const headings = {
    buscar: ["Consultar Servicios", "Explora tarifas y disponibilidad en tiempo real"],
    sedes: ["Particulares", "Explora tarifas particulares de sedes propias"],
    ajustes: ["Gestión de Portafolio", "Configura la visibilidad del catálogo nacional"],
  };
  const [headTitle, headSub] = headings[tab] || headings.buscar;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        html, body, #root { margin: 0; padding: 0; height: 100%; width: 100%; overflow-x: hidden; }
        body { background: #f8fafc; color: #0c2d6b; -webkit-font-smoothing: antialiased; }
        * { box-sizing: border-box; }
        select, input { font-family: inherit; }
        mark { background: #c8f0e8; color: #0a5c4a; border-radius: 2px; padding: 0 2px; }
        .filter-btn {
          display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 8px;
          border: 1.5px solid #eef1f6; background: #fff; color: #6b7a99; font-size: 13px;
          fontWeight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .filter-btn.active { border-color: #1aab8a; color: #1aab8a; background: #e8faf5; }
        .checkbox-container { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; font-size: 13px; font-weight: 700; color: #6b7a99; }
        .checkbox-container input { cursor: pointer; width: 18px; height: 18px; accent-color: #1aab8a; }
        .badge-touch { min-width: clamp(36px, 11vw, 44px); min-height: clamp(36px, 11vw, 44px); display: flex; flex-direction: column; justify-content: center; }

        /* ── Responsive visibility ── */
        /* Default (mobile-first): hide desktop, show mobile compact badge */
        .nav-desktop-only { display: none; }
        .nav-desktop-tabs { display: none; }
        .nav-mobile-only { display: flex; margin-left: auto; align-items: center; gap: 8px; flex-shrink: 0; }
        .filter-desktop { display: none; }
        .filter-mobile-btn { display: flex; }

        /* ≥ 769px: show tabs and inline filters (tablet mode) */
        @media (min-width: 769px) {
          .nav-desktop-tabs { display: flex !important; gap: 4px; height: 100%; align-items: center; }
          .filter-desktop { display: flex !important; gap: 12px; align-items: center; }
          .filter-mobile-btn { display: none !important; }
        }

        /* ≥ 960px: show desktop badges, hide mobile hamburger (full desktop) */
        @media (min-width: 960px) {
          .nav-desktop-only { display: flex !important; }
          .nav-mobile-only { display: none !important; }
        }

        /* ≤ 768px: compact mobile layout */
        @media (max-width: 768px) {
          main { padding: 20px 12px !important; }
          .nav-inner { gap: clamp(6px, 2vw, 12px) !important; }
          .nav-logo-wrap { flex-shrink: 1 !important; min-width: 0 !important; overflow: hidden !important; }
          .nav-subtitle { display: none !important; }
          .nav-title-text { white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
        }

        /* ── Overlay ── */
        .overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); z-index: 100;
          animation: fadeIn 0.2s ease;
        }

        /* ── Menu drawer (right side) ── */
        .menu-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; width: 300px; max-width: 85vw;
          background: #0c2d6b; z-index: 101; overflow-y: auto;
          padding: 24px 20px;
          animation: slideInRight 0.25s ease;
          box-shadow: -4px 0 20px rgba(0,0,0,0.2);
        }
        .menu-drawer-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
        }
        .menu-drawer-header h3 { color: #fff; font-size: 14px; margin: 0; }

        /* ── Filter sheet (bottom) ── */
        .filter-sheet {
          position: fixed; left: 0; right: 0; bottom: 0;
          background: #fff; z-index: 101;
          border-radius: 16px 16px 0 0;
          max-height: 85vh; overflow-y: auto;
          padding: 24px 20px 32px;
          animation: slideUp 0.3s ease;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
        }
        .filter-sheet-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
        }
        .filter-sheet-header h3 { font-size: 16px; font-weight: 800; color: "#0c2d6b"; margin: 0; }
        .filter-sheet-section { margin-bottom: 16px; }
        .filter-sheet-label { font-size: 11px; font-weight: 700; color: "#6b7a99"; text-transform: uppercase; margin-bottom: 8px; }

        /* ── Hamburger button ── */
        .hamburger-btn {
          min-width: clamp(36px, 11vw, 44px); min-height: clamp(36px, 11vw, 44px); display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer; color: #fff; border-radius: 8px;
        }
        .hamburger-btn:hover { background: rgba(255,255,255,0.1); }

        /* ── Filter mobile button ── */
        .filter-mob-btn {
          min-width: clamp(36px, 11vw, 44px); min-height: clamp(36px, 11vw, 44px); display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px 16px; border-radius: 8px; border: 1.5px solid #eef1f6;
          background: #fff; color: #6b7a99; font-size: 13px; font-weight: 700; cursor: pointer;
        }

        /* ── Animations ── */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>

      {/* ── TOP NAVBAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#0c2d6b", borderBottom: "1px solid rgba(255,255,255,0.1)", width: "100%",
      }}>
        <div className="nav-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(8px, 3vw, 24px)", minHeight: "clamp(52px, 16vw, 64px)", display: "flex", alignItems: "center", gap: "clamp(6px, 3vw, 24px)" }}>
          {/* Logo + title (always visible) */}
          <div className="nav-logo-wrap" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <img src={LOGO_B64} alt="Omnisalud" style={{ height: 32, objectFit: "contain", mixBlendMode: "screen" }} />
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 12 }}>
              <h1 className="nav-title-text" style={{ fontSize: "clamp(11px, 3.5vw, 14px)", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                {headTitle}
              </h1>
              <p className="nav-subtitle" style={{ fontSize: "clamp(8px, 2.5vw, 10px)", color: "rgba(255,255,255,0.5)", margin: "2px 0 0", lineHeight: 1.2 }}>
                {headSub}
              </p>
            </div>
          </div>

          {/* Desktop tabs */}
          <nav className="nav-desktop-tabs">
            {tabsDef.map(([key, label]) => (
              <button key={key} onClick={() => switchTab(key)} style={{
                border: "none", cursor: "pointer", height: 40, padding: "0 16px",
                borderRadius: 8, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8,
                background: tab === key ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === key ? "#fff" : "rgba(255,255,255,0.6)",
                transition: "all .2s",
              }}>{label}</button>
            ))}
          </nav>

          {/* Desktop badges */}
          <div className="nav-desktop-only" style={{ marginLeft: "auto", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {tab === "sedes" ? (
              <>
                <StatBadge label="Total Servicios" value={totalSedes.toLocaleString()} />
                <StatBadge label="Paquetes" value={totalPaquetes.toLocaleString()} color="#1aab8a" />
              </>
            ) : (
              <>
                <StatBadge label={`Total Servicios ${currentCiudadLabel}`} value={servicesInCity.toLocaleString()} />
                <StatBadge label="Ciudades" value={totalCiudades} color="#1aab8a" />
                <StatBadge label="Total Servicios" value={totalActivos.toLocaleString()} />
                {rol === "admin" && (
                  <StatBadge label="Inactivos" value={totalInactivos.toLocaleString()} variant="red" />
                )}
              </>
            )}
          </div>

          {/* Mobile: compact badge + hamburger */}
          <div className="nav-mobile-only" style={{ marginLeft: "auto", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div className="nav-mobile-badge" style={{
              background: "rgba(255,255,255,0.1)", padding: "clamp(4px, 1.5vw, 6px) clamp(8px, 2vw, 12px)", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)", textAlign: "right",
            }}>
              <div style={{ fontSize: "clamp(7px, 2vw, 9px)", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Total Servicios</div>
              <div style={{ fontSize: "clamp(12px, 3.5vw, 14px)", fontWeight: 800, color: "#fff" }}>{(tab === "sedes" ? totalSedes : totalActivos).toLocaleString()}</div>
            </div>
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú de navegación"
            >
              <IconHamburger size={22} color="#fff" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HAMBURGER MENU DRAWER ── */}
      {menuOpen && (
        <>
          <div className="overlay" onClick={closeMenu} aria-hidden="true" />
          <div className="menu-drawer" role="dialog" aria-label="Menú de navegación">
            <div className="menu-drawer-header">
              <h3>Menú</h3>
              <button onClick={closeMenu} className="hamburger-btn" aria-label="Cerrar menú">
                <IconClose size={20} color="#fff" />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
              {tabsDef.map(([key, label]) => (
                <button key={key} onClick={() => switchTab(key)} style={{
                  border: "none", cursor: "pointer", height: 44, padding: "0 16px",
                  borderRadius: 8, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8,
                  background: tab === key ? "rgba(255,255,255,0.1)" : "transparent",
                  color: tab === key ? "#fff" : "rgba(255,255,255,0.6)",
                  width: "100%", textAlign: "left",
                }}>{label}</button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── FILTER BOTTOM SHEET ── */}
      {filterOpen && (
        <>
          <div className="overlay" onClick={closeFilter} aria-hidden="true" />
          <div className="filter-sheet" role="dialog" aria-label="Filtros">
            <div className="filter-sheet-header">
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0c2d6b", margin: 0 }}>Filtros</h3>
              <button onClick={closeFilter} style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }} aria-label="Cerrar filtros">
                <IconClose size={20} color="#6b7a99" />
              </button>
            </div>

            <div className="filter-sheet-section">
              <div className="filter-sheet-label" style={{ fontSize: 11, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginBottom: 8 }}>{tab === "sedes" ? "Tipo" : "Ciudad"}</div>
              {tab === "buscar" ? (
                <CitySelect value={ciudad} onChange={(e) => { setCiudad(e.target.value); closeFilter(); }} ciudades={ciudades} />
              ) : tab === "sedes" ? (
                <PaqSelect value={sedesFilter} onChange={(e) => { setSedesFilter(e.target.value); closeFilter(); }} />
              ) : (
                <CitySelect value={adjCiudad} onChange={(e) => { setAdjCiudad(e.target.value); closeFilter(); }} ciudades={ciudades} />
              )}
            </div>

            <div className="filter-sheet-section">
              <div className="filter-sheet-label" style={{ fontSize: 11, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginBottom: 8 }}>Orden</div>
              <SortControls
                handleSortAlpha={handleSortAlpha}
                handleSortPrice={handleSortPrice}
                sortAlpha={sortAlpha}
                sortPrice={sortPrice}
                onlyInactive={tab === "ajustes" ? onlyInactive : null}
                setOnlyInactive={tab === "ajustes" ? setOnlyInactive : null}
                vertical
              />
            </div>

            <div className="filter-sheet-section" style={{ marginTop: 16 }}>
              <div className="filter-sheet-label" style={{ fontSize: 11, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginBottom: 8 }}>Estadísticas</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 auto", background: "#f8fafc", padding: "12px 14px", borderRadius: 8, border: "1px solid #eef1f6", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#0c2d6b" }}>{(tab === "sedes" ? totalSedes : servicesInCity).toLocaleString()}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginTop: 2 }}>{tab === "sedes" ? "Servicios" : `Servicios ${currentCiudadLabel}`}</div>
                </div>
                <div style={{ flex: "1 1 auto", background: "#f8fafc", padding: "12px 14px", borderRadius: 8, border: "1px solid #eef1f6", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#1aab8a" }}>{tab === "sedes" ? totalPaquetes : totalCiudades}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginTop: 2 }}>{tab === "sedes" ? "Paquetes" : "Ciudades"}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {tab === "buscar" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Search bar */}
              <div style={{ background: "#fff", padding: "20px", borderRadius: 12, boxShadow: "0 4px 12px rgba(10,40,90,0.04)", border: "1px solid #eef1f6", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}><IconSearch size={16} color="#94a3b8" /></span>
                  <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o código..." style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, outline: "none", background: "#f8fafc", color: "#0c2d6b" }} />
                  {query && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}><ClearBtn onClick={() => { setQuery(""); inputRef.current?.focus(); }} /></span>}
                </div>

                {/* Desktop inline filters */}
                <div className="filter-desktop" style={{ gap: 12, alignItems: "center" }}>
                  <div style={{ position: "relative", width: 200 }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}><IconLocation size={14} color="#94a3b8" /></span>
                    <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 38px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, fontWeight: 600, appearance: "none", background: "#f8fafc", color: "#0c2d6b", cursor: "pointer" }}>
                      {ciudades.map((c) => (<option key={c} value={c}>{c === "TODAS" ? "Todas las ciudades" : c}</option>))}
                    </select>
                  </div>
                  <SortControls handleSortAlpha={handleSortAlpha} handleSortPrice={handleSortPrice} sortAlpha={sortAlpha} sortPrice={sortPrice} />
                </div>

                {/* Mobile filter button */}
                <div className="filter-mobile-btn">
                  <button className="filter-mob-btn" onClick={() => setFilterOpen(true)} aria-label="Abrir filtros">
                    <IconFilter size={16} /> Filtros
                  </button>
                </div>
              </div>

              {/* Results */}
              <div>
                {!query && ciudad === "TODAS" ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 12, border: "1px dashed #cbd5e1" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                    <h3 style={{ margin: 0, color: "#4a5b7a" }}>Comienza tu búsqueda</h3>
                    <p style={{ color: "#8a9ab8", fontSize: 14 }}>Ingresa un término o selecciona una ciudad para ver resultados.</p>
                  </div>
                ) : resultados.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>😕</div>
                    <h3 style={{ margin: 0, color: "#4a5b7a" }}>No encontramos coincidencias</h3>
                    <p style={{ color: "#8a9ab8", fontSize: 14 }}>Prueba con otros términos o verifica los filtros.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
                      <span style={{ fontSize: 12, color: "#6b7a99", fontWeight: 700 }}>MOSTRANDO {resultados.length} RESULTADOS</span>
                    </div>
                    {resultados.map((item, i) => <ServiceCard key={i} item={item} query={query} />)}
                  </>
                )}
              </div>
            </div>
          )}

          {tab === "sedes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Search bar */}
              <div style={{ background: "#fff", padding: "20px", borderRadius: 12, boxShadow: "0 4px 12px rgba(10,40,90,0.04)", border: "1px solid #eef1f6", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}><IconSearch size={16} color="#94a3b8" /></span>
                  <input ref={sedesInputRef} value={sedesQuery} onChange={(e) => setSedesQuery(e.target.value)} placeholder="Buscar por nombre o código..." style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, outline: "none", background: "#f8fafc", color: "#0c2d6b" }} />
                  {sedesQuery && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}><ClearBtn onClick={() => { setSedesQuery(""); sedesInputRef.current?.focus(); }} /></span>}
                </div>

                {/* Desktop inline filters */}
                <div className="filter-desktop" style={{ gap: 12, alignItems: "center" }}>
                  <div style={{ width: 200 }}>
                    <PaqSelect value={sedesFilter} onChange={(e) => setSedesFilter(e.target.value)} />
                  </div>
                  <SortControls handleSortAlpha={handleSortAlpha} handleSortPrice={handleSortPrice} sortAlpha={sortAlpha} sortPrice={sortPrice} />
                </div>

                {/* Mobile filter button */}
                <div className="filter-mobile-btn">
                  <button className="filter-mob-btn" onClick={() => setFilterOpen(true)} aria-label="Abrir filtros">
                    <IconFilter size={16} /> Filtros
                  </button>
                </div>
              </div>

              {/* Results */}
              <div>
                {resultadosSedes.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>😕</div>
                    <h3 style={{ margin: 0, color: "#4a5b7a" }}>No encontramos coincidencias</h3>
                    <p style={{ color: "#8a9ab8", fontSize: 14 }}>Prueba con otros términos o verifica los filtros.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
                      <span style={{ fontSize: 12, color: "#6b7a99", fontWeight: 700 }}>MOSTRANDO {resultadosSedes.length} RESULTADOS</span>
                    </div>
                    {resultadosSedes.map((item, i) => <ServiceCard key={i} item={item} query={sedesQuery} />)}
                  </>
                )}
              </div>
            </div>
          )}

          {tab === "ajustes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Search bar */}
              <div style={{ background: "#fff", padding: "20px", borderRadius: 12, boxShadow: "0 4px 12px rgba(10,40,90,0.04)", border: "1px solid #eef1f6" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}><IconSearch size={16} color="#94a3b8" /></span>
                    <input ref={adjInputRef} value={adjQuery} onChange={(e) => setAdjQuery(e.target.value)} placeholder="Filtrar servicios..." style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, outline: "none", background: "#f8fafc" }} />
                  </div>

                  {/* Desktop inline filters */}
                  <div className="filter-desktop" style={{ gap: 12, alignItems: "center" }}>
                    <div style={{ position: "relative", width: 200 }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}><IconLocation size={14} color="#94a3b8" /></span>
                      <select value={adjCiudad} onChange={(e) => setAdjCiudad(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 38px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, fontWeight: 600, appearance: "none", background: "#f8fafc", cursor: "pointer" }}>
                        {ciudades.map((c) => (<option key={c} value={c}>{c === "TODAS" ? "Todas las ciudades" : c}</option>))}
                      </select>
                    </div>
                    <SortControls handleSortAlpha={handleSortAlpha} handleSortPrice={handleSortPrice} sortAlpha={sortAlpha} sortPrice={sortPrice} onlyInactive={onlyInactive} setOnlyInactive={setOnlyInactive} />
                  </div>

                  {/* Mobile filter button */}
                  <div className="filter-mobile-btn">
                    <button className="filter-mob-btn" onClick={() => setFilterOpen(true)} aria-label="Abrir filtros">
                      <IconFilter size={16} /> Filtros
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                {!adjQuery && adjCiudad === "TODAS" && !onlyInactive ? (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⚙️</div>
                    <h3 style={{ margin: 0, color: "#4a5b7a" }}>Panel de Gestión</h3>
                    <p style={{ color: "#8a9ab8", fontSize: 14 }}>Busca un servicio o activa el filtro de inactivos para gestionar.</p>
                  </div>
                ) : resultadosAdj.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>😕</div>
                    <h3 style={{ margin: 0, color: "#4a5b7a" }}>No encontramos coincidencias</h3>
                    <p style={{ color: "#8a9ab8", fontSize: 14 }}>Prueba con otros términos o verifica los filtros.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 12, padding: "0 4px" }}>
                      <span style={{ fontSize: 12, color: "#6b7a99", fontWeight: 700 }}>{resultadosAdj.length} ENCONTRADOS {onlyInactive ? "(INACTIVOS)" : ""}</span>
                    </div>
                    {resultadosAdj.map((item, i) => {
                      const isOff = !item.active;
                      return (
                        <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", marginBottom: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.02)", border: "1px solid #eef1f6", borderLeft: isOff ? "4px solid #cbd5e1" : "4px solid #1aab8a", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, opacity: isOff ? 0.6 : 1 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#0c2d6b", textDecoration: isOff ? "line-through" : "none" }}>{item.servicio || item.codigo}</div>
                            <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#1aab8a" }}>{item.codigo}</span>
                              <span style={{ fontSize: 11, color: "#6b7a99", display: "flex", alignItems: "center", gap: 4 }}><IconLocation size={12} color="#94a3b8" /> {item.ciudad}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#0c2d6b" }}>{formatPrecio(item.precio)}</span>
                            </div>
                          </div>
                          <div onClick={() => toggleActive(item.id, item.active)} style={{ flexShrink: 0, width: 44, height: 24, borderRadius: 12, background: isOff ? "#cbd5e1" : "#1aab8a", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                            <div style={{ position: "absolute", top: 3, left: isOff ? 3 : 23, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "left 0.2s" }} />
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}

          <footer style={{ textAlign: "center", padding: "40px 0 20px", color: "#94a3b8", fontSize: 11, borderTop: "1px solid #e2e8f0", marginTop: 40 }}>
            Omnisalud S.A.S · Sistema de Red Nacional · Versión 1.2 · {new Date().getFullYear()}
          </footer>
        </div>
      </main>

      {/* ── PASSWORD MODAL ── */}
      {showPasswordModal && (
        <>
          <div className="overlay" onClick={() => { setShowPasswordModal(false); setPasswordInput(""); setPasswordError(false); }} aria-hidden="true" />
          <div className="password-modal" role="dialog" aria-label="Autenticación requerida">
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0c2d6b" }}>Acceso Restringido</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#6b7a99" }}>Ingresa la contraseña para {pendingTab === "sedes" ? "acceder a Particulares" : "acceder al panel de ajustes"}</p>
              </div>
              <input
                ref={passwordRef}
                type="password"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                placeholder="Contraseña"
                autoFocus
                style={{
                  width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 8,
                  border: `1.5px solid ${passwordError ? "#ef4444" : "#eef1f6"}`,
                  fontSize: 14, outline: "none", background: "#f8fafc", color: "#0c2d6b", marginBottom: passwordError ? 4 : 12,
                }}
              />
              {passwordError && (
                <p style={{ margin: "0 0 12px", fontSize: 12, color: "#ef4444", fontWeight: 600 }}>Contraseña incorrecta</p>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => { setShowPasswordModal(false); setPasswordInput(""); setPasswordError(false); }}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "1.5px solid #eef1f6",
                    background: "#fff", color: "#6b7a99", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}>
                  Cancelar
                </button>
                <button type="submit"
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                    background: "#0c2d6b", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}>
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <style>{`
        .password-modal {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: #fff; z-index: 101; border-radius: 16px;
          padding: 28px 24px; width: 360px; max-width: 90vw;
          box-shadow: 0 8px 40px rgba(0,0,0,0.2);
          animation: fadeIn 0.2s ease;
        }
      `}</style>
    </div>
  );
}
