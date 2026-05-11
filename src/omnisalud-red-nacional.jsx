import { useState, useMemo, useRef, useEffect } from "react";
import { LOGO_B64 } from "./data/logo.js";
import { fetchServicios, fetchCiudades, updateServicioActive } from "./api/servicios.js";

const normalize = (str) =>
  str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

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
          {highlight(item.servicio)}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1aab8a", background: "#e8faf5", borderRadius: 4, padding: "1px 6px", textTransform: "uppercase" }}>
            {item.codigo}
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#6b7a99", display: "flex", alignItems: "center", gap: 4 }}>
            <IconLocation size={12} color="#94a3b8" /> {item.ciudad}
          </span>
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
  
  // Sorting States: 0 = none/default, 1 = asc, 2 = desc
  const [sortAlpha, setSortAlpha] = useState(1); 
  const [sortPrice, setSortPrice] = useState(0);
  const [onlyInactive, setOnlyInactive] = useState(false);

  const inputRef = useRef(null);
  const adjInputRef = useRef(null);

  useEffect(() => {
    if (rol === "admin" && tab === "buscar") setTab("ajustes");
    if (rol === "cliente" && tab === "ajustes") setTab("buscar");
  }, [rol]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    Promise.all([fetchServicios(), fetchCiudades()])
      .then(([servs, ciuds]) => {
        if (cancelled) return;
        setPortafolio(servs);
        setCiudades(["TODAS", ...ciuds]);
      })
      .catch((err) => { if (!cancelled) setLoadError(err.message || "Error de conexión"); })
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

  const totalCiudades = useMemo(() => new Set(portafolio.map((r) => r.ciudad)).size, [portafolio]);

  const applySort = (items) => {
    if (sortAlpha) {
      items.sort((a, b) => sortAlpha === 1 
        ? a.servicio.localeCompare(b.servicio) 
        : b.servicio.localeCompare(a.servicio)
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
      const matchActive = onlyInactive ? !r.active : r.active;
      const matchCiudad = adjCiudad === "TODAS" || r.ciudad === adjCiudad;
      const matchQuery = !adjQuery || normalize(r.servicio).includes(normalize(adjQuery)) || normalize(r.codigo).includes(normalize(adjQuery));
      return matchActive && matchCiudad && matchQuery;
    });
    return applySort(items).slice(0, 100);
  }, [adjQuery, adjCiudad, portafolio, sortAlpha, sortPrice, onlyInactive]);

  const servicesInCity = useMemo(() => {
    const currentCiudad = tab === "buscar" ? ciudad : adjCiudad;
    const activePortafolio = portafolio.filter(r => r.active);
    if (currentCiudad === "TODAS") return activePortafolio.length;
    return activePortafolio.filter(r => r.ciudad === currentCiudad).length;
  }, [portafolio, ciudad, adjCiudad, tab]);

  const tabsDef = [
    ["buscar", <><IconConsult size={16} /> Consultar</>],
    ["ajustes", <><IconSettings size={16} /> Ajustes</>],
  ];

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
      `}</style>

      {/* ── TOP NAVBAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#0c2d6b", borderBottom: "1px solid rgba(255,255,255,0.1)", width: "100%",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <img src={LOGO_B64} alt="Omnisalud" style={{ height: 32, objectFit: "contain", mixBlendMode: "screen" }} />
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 12, color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", lineHeight: 1.2 }}>
              Red Nacional<br />de Proveedores
            </div>
          </div>

          <nav style={{ display: "flex", gap: 4, height: "100%", alignItems: "center" }}>
            {tabsDef.map(([key, label]) => (
              <button key={key} onClick={() => {
                setTab(key);
                setRol(key === "buscar" ? "cliente" : "admin");
              }} style={{
                border: "none", cursor: "pointer", height: 40, padding: "0 16px",
                borderRadius: 8, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8,
                background: tab === key ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === key ? "#fff" : "rgba(255,255,255,0.6)",
                transition: "all .2s",
              }}>{label}</button>
            ))}
          </nav>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase" }}>Vista Activa</div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{rol === "admin" ? "Panel Administrativo" : "Portal de Consultas"}</div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0c2d6b", margin: 0 }}>
                {tab === "buscar" ? "Consultar Servicios" : "Gestión de Portafolio"}
              </h1>
              <p style={{ fontSize: 13, color: "#6b7a99", margin: "4px 0 0" }}>
                {tab === "buscar" ? "Explora tarifas y disponibilidad en tiempo real" : "Configura la visibilidad del catálogo nacional"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ background: "#fff", padding: "8px 16px", borderRadius: 10, border: "1px solid #eef1f6", textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginBottom: 2 }}>
                  Total Servicios {tab === "buscar" ? (ciudad === "TODAS" ? "Red" : ciudad) : (adjCiudad === "TODAS" ? "Red" : adjCiudad)}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0c2d6b" }}>{servicesInCity.toLocaleString()}</div>
              </div>
              <div style={{ background: "#fff", padding: "8px 16px", borderRadius: 10, border: "1px solid #eef1f6", textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginBottom: 2 }}>Ciudades</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1aab8a" }}>{totalCiudades}</div>
              </div>
              <div style={{ background: "#fff", padding: "8px 16px", borderRadius: 10, border: "1px solid #eef1f6", textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginBottom: 2 }}>Total Servicios</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0c2d6b" }}>{portafolio.filter(r => r.active).length.toLocaleString()}</div>
              </div>
              {rol === "admin" && (
                <div style={{ background: "#fff", padding: "8px 16px", borderRadius: 10, border: "1px solid #fee2e2", textAlign: "right" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", marginBottom: 2 }}>Inactivos</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#ef4444" }}>{portafolio.filter(r => !r.active).length.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>

          {tab === "buscar" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#fff", padding: "20px", borderRadius: 12, boxShadow: "0 4px 12px rgba(10,40,90,0.04)", border: "1px solid #eef1f6", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}><IconSearch size={16} color="#94a3b8" /></span>
                  <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o código..." style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, outline: "none", background: "#f8fafc", color: "#0c2d6b" }} />
                  {query && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}><ClearBtn onClick={() => { setQuery(""); inputRef.current?.focus(); }} /></span>}
                </div>
                <div style={{ position: "relative", width: 200 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}><IconLocation size={14} color="#94a3b8" /></span>
                  <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 38px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, fontWeight: 600, appearance: "none", background: "#f8fafc", color: "#0c2d6b", cursor: "pointer" }}>
                    {ciudades.map((c) => (<option key={c} value={c}>{c === "TODAS" ? "Todas las ciudades" : c}</option>))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleSortAlpha} className={`filter-btn ${sortAlpha ? "active" : ""}`}>
                    <IconSortAZ size={16} /> {sortAlpha === 2 ? "Z-A" : "A-Z"}
                  </button>
                  <button onClick={handleSortPrice} className={`filter-btn ${sortPrice ? "active" : ""}`}>
                    <IconSortPrice size={16} /> {sortPrice === 2 ? "Mayor" : "Menor"}
                  </button>
                </div>
              </div>
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

          {tab === "ajustes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#fff", padding: "20px", borderRadius: 12, boxShadow: "0 4px 12px rgba(10,40,90,0.04)", border: "1px solid #eef1f6" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}><IconSearch size={16} color="#94a3b8" /></span>
                    <input ref={adjInputRef} value={adjQuery} onChange={(e) => setAdjQuery(e.target.value)} placeholder="Filtrar servicios..." style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, outline: "none", background: "#f8fafc" }} />
                  </div>
                  <div style={{ position: "relative", width: 200 }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}><IconLocation size={14} color="#94a3b8" /></span>
                    <select value={adjCiudad} onChange={(e) => setAdjCiudad(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 38px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, fontWeight: 600, appearance: "none", background: "#f8fafc", cursor: "pointer" }}>
                      {ciudades.map((c) => (<option key={c} value={c}>{c === "TODAS" ? "Todas las ciudades" : c}</option>))}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleSortAlpha} className={`filter-btn ${sortAlpha ? "active" : ""}`}>
                      <IconSortAZ size={16} /> {sortAlpha === 2 ? "Z-A" : "A-Z"}
                    </button>
                    <button onClick={handleSortPrice} className={`filter-btn ${sortPrice ? "active" : ""}`}>
                      <IconSortPrice size={16} /> {sortPrice === 2 ? "Mayor" : "Menor"}
                    </button>
                    <button onClick={() => setOnlyInactive(!onlyInactive)} className={`filter-btn ${onlyInactive ? "active" : ""}`} style={{ color: onlyInactive ? "#ef4444" : "#6b7a99", borderColor: onlyInactive ? "#ef4444" : "#eef1f6", background: onlyInactive ? "#fef2f2" : "#fff" }}>
                      {onlyInactive ? <IconEyeOff size={18} color="#ef4444" /> : <IconEye size={18} color="#6b7a99" />}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {!adjQuery && adjCiudad === "TODAS" && !onlyInactive ? (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⚙️</div>
                    <h3 style={{ margin: 0, color: "#4a5b7a" }}>Panel de Gestión</h3>
                    <p style={{ color: "#8a9ab8", fontSize: 14 }}>Busca un servicio o activa el filtro de inactivos para gestionar.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 12, padding: "0 4px" }}>
                      <span style={{ fontSize: 12, color: "#6b7a99", fontWeight: 700 }}>{resultadosAdj.length} ENCONTRADOS {onlyInactive ? "(INACTIVOS)" : ""}</span>
                    </div>
                    {resultadosAdj.map((item, i) => {
                      const isOff = !item.active;
                      return (
                        <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", marginBottom: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.02)", border: "1px solid #eef1f6", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, opacity: isOff ? 0.6 : 1 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#0c2d6b", textDecoration: isOff ? "line-through" : "none" }}>{item.servicio}</div>
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
    </div>
  );
}
