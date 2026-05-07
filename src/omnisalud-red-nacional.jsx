import { useState, useMemo, useRef, useEffect } from "react";
import { PORTAFOLIO } from "./data/portafolio.js";
import { LOGO_B64 } from "./data/logo.js";

const normalize = (str) =>
  str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const formatPrecio = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const CIUDADES = ["TODAS", ...Array.from(new Set(PORTAFOLIO.map((r) => r.ciudad))).sort()];

const ADMIN_PASSWORD = "omni2025";

function ClearBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 6px", color: "#6b7a99", fontSize: 18, lineHeight: 1 }}>
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
        <mark style={{ background: "#c8f0e8", color: "#0a5c4a", borderRadius: 3, padding: "0 2px" }}>
          {text.slice(idx, idx + query.length)}
        </mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 10,
      boxShadow: "0 2px 8px rgba(10,40,90,0.07)", borderLeft: "4px solid #1aab8a",
      display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0c2d6b", lineHeight: 1.3, marginBottom: 4 }}>
          {highlight(item.servicio)}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#1aab8a", background: "#e8faf5", borderRadius: 20, padding: "2px 9px", letterSpacing: 0.3 }}>
            {item.codigo}
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#4a5b7a", background: "#f0f3fa", borderRadius: 20, padding: "2px 9px", letterSpacing: 0.3 }}>
            📍 {item.ciudad}
          </span>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#0c2d6b" }}>
          {formatPrecio(item.precio)}
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const handleAdmin = () => {
    if (pass === ADMIN_PASSWORD) { onLogin("admin"); }
    else { setError(true); setTimeout(() => setError(false), 1500); }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "linear-gradient(135deg, #0c2d6b 0%, #0d4a9e 50%, #0a7a5a 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: "#f4f6fb", borderRadius: 24, boxShadow: "0 20px 60px rgba(12,45,107,0.35)", width: "100%", maxWidth: 480, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "linear-gradient(135deg, #0c2d6b 0%, #0d4a9e 60%, #1aab8a 100%)", padding: "44px 28px 36px", borderRadius: "0 0 36px 36px", boxShadow: "0 6px 28px rgba(12,45,107,0.30)", textAlign: "center" }}>
          <div style={{ width: 240, height: 70, margin: "0 auto 20px" }}>
            <img src={LOGO_B64} alt="Omnisalud" style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "screen" }} />
          </div>
          <div style={{ color: "#fff", fontSize: 16, fontWeight: 800, letterSpacing: 0.3, marginBottom: 6 }}>Red Nacional de Proveedores</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, letterSpacing: 0.8, textTransform: "uppercase" }}>Consulta de Tarifas</div>
        </div>

        <div style={{ padding: "32px 24px", flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#0c2d6b", marginBottom: 6, textAlign: "center" }}>¿Cómo deseas ingresar?</div>
          <div style={{ fontSize: 13, color: "#6b7a99", textAlign: "center", marginBottom: 28 }}>Selecciona tu perfil de acceso</div>

          <button onClick={() => onLogin("cliente")} style={{ width: "100%", padding: "18px 20px", borderRadius: 14, border: "2px solid #e2e8f4", background: "#fff", cursor: "pointer", textAlign: "left", marginBottom: 14, boxShadow: "0 2px 10px rgba(10,40,90,0.07)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #e8f4ff, #c8e8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎧</div>
            <div>
              <div style={{ fontWeight: 800, color: "#0c2d6b", fontSize: 15 }}>Servicio al Cliente</div>
              <div style={{ fontSize: 12, color: "#6b7a99", marginTop: 2 }}>Acceso directo · Consulta de tarifas</div>
            </div>
            <span style={{ marginLeft: "auto", color: "#1aab8a", fontSize: 20 }}>›</span>
          </button>

          {!showAdmin ? (
            <button onClick={() => setShowAdmin(true)} style={{ width: "100%", padding: "18px 20px", borderRadius: 14, border: "2px solid #e2e8f4", background: "#fff", cursor: "pointer", textAlign: "left", boxShadow: "0 2px 10px rgba(10,40,90,0.07)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #e8fff4, #c8f0e4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🔐</div>
              <div>
                <div style={{ fontWeight: 800, color: "#0c2d6b", fontSize: 15 }}>Administrador Comercial</div>
                <div style={{ fontSize: 12, color: "#6b7a99", marginTop: 2 }}>Requiere contraseña · Gestión de portafolio</div>
              </div>
              <span style={{ marginLeft: "auto", color: "#1aab8a", fontSize: 20 }}>›</span>
            </button>
          ) : (
            <div style={{ background: "#fff", borderRadius: 14, border: "2px solid #e2e8f4", padding: "18px 20px", boxShadow: "0 2px 10px rgba(10,40,90,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 22 }}>🔐</div>
                <div style={{ fontWeight: 800, color: "#0c2d6b", fontSize: 15 }}>Administrador Comercial</div>
              </div>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdmin()}
                placeholder="Contraseña de acceso" autoFocus
                style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px", borderRadius: 10, border: `2px solid ${error ? "#e53935" : "#e2e8f4"}`, fontSize: 14, outline: "none", background: error ? "#fff5f5" : "#f8fafc", color: "#0c2d6b", marginBottom: 10, transition: "border .2s" }}
              />
              {error && <div style={{ color: "#e53935", fontSize: 12, marginBottom: 10, fontWeight: 600 }}>❌ Contraseña incorrecta</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setShowAdmin(false); setPass(""); }} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "2px solid #e2e8f4", background: "#f0f3fa", cursor: "pointer", fontWeight: 700, color: "#6b7a99", fontSize: 13 }}>Cancelar</button>
                <button onClick={handleAdmin} style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0c2d6b, #1aab8a)", cursor: "pointer", fontWeight: 800, color: "#fff", fontSize: 13 }}>Ingresar</button>
              </div>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", padding: "0 0 24px", color: "#b0bbcc", fontSize: 11 }}>Omnisalud · Red Nacional de Proveedores · v1.0</div>
      </div>
    </div>
  );
}

export default function App() {
  const [rol, setRol] = useState(null);
  const [query, setQuery] = useState("");
  const [ciudad, setCiudad] = useState("TODAS");
  const [portafolio] = useState(() => {
    try {
      const extras = JSON.parse(localStorage.getItem("omni_servicios_extra") || "[]");
      return extras.length > 0 ? [...PORTAFOLIO, ...extras] : PORTAFOLIO;
    } catch { return PORTAFOLIO; }
  });
  const [tab, setTab] = useState("buscar");
  const [disabled, setDisabled] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("omni_disabled") || "[]")); }
    catch { return new Set(); }
  });
  const [adjQuery, setAdjQuery] = useState("");
  const [adjCiudad, setAdjCiudad] = useState("TODAS");
  const inputRef = useRef(null);
  const adjInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("omni_disabled", JSON.stringify([...disabled]));
  }, [disabled]);

  useEffect(() => {
    if (rol === "admin" && tab === "buscar") setTab("ajustes");
  }, [rol]);

  const toggleDisabled = (key) => {
    setDisabled(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const portafolioActivo = useMemo(() => portafolio.filter(r => !disabled.has(`${r.ciudad}|${r.codigo}`)), [portafolio, disabled]);
  const totalCiudades = useMemo(() => new Set(portafolio.map((r) => r.ciudad)).size, [portafolio]);

  const resultados = useMemo(() => {
    if (!query && ciudad === "TODAS") return [];
    return portafolioActivo.filter((r) => {
      const matchCiudad = ciudad === "TODAS" || r.ciudad === ciudad;
      const matchQuery = !query || normalize(r.servicio).includes(normalize(query)) || normalize(r.codigo).includes(normalize(query));
      return matchCiudad && matchQuery;
    }).slice(0, 60);
  }, [query, ciudad, portafolioActivo]);

  const resultadosAdj = useMemo(() => {
    if (!adjQuery && adjCiudad === "TODAS") return [];
    return portafolio.filter((r) => {
      const matchCiudad = adjCiudad === "TODAS" || r.ciudad === adjCiudad;
      const matchQuery = !adjQuery || normalize(r.servicio).includes(normalize(adjQuery)) || normalize(r.codigo).includes(normalize(adjQuery));
      return matchCiudad && matchQuery;
    }).slice(0, 80);
  }, [adjQuery, adjCiudad, portafolio]);

  const tabsDef = [
    ...(rol === "cliente" ? [["buscar", "🔍 Consultar"]] : []),
    ...(rol === "admin" ? [["ajustes", "⚙️ Ajustes"]] : []),
  ];

  if (!rol) return <LoginScreen onLogin={setRol} />;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f0f2f8", minHeight: "100vh", display: "flex" }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 240, flexShrink: 0, minHeight: "100vh",
        background: "linear-gradient(180deg, #0c2d6b 0%, #0d4a9e 60%, #0a5a3a 100%)",
        display: "flex", flexDirection: "column",
        boxShadow: "4px 0 20px rgba(12,45,107,0.22)",
        position: "sticky", top: 0, height: "100vh",
      }}>
        <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ width: "100%", height: 52 }}>
            <img src={LOGO_B64} alt="Omnisalud" style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "screen" }} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, textAlign: "center", marginTop: 8, letterSpacing: 1, textTransform: "uppercase" }}>
            Red Nacional de Proveedores
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {tabsDef.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              width: "100%", border: "none", cursor: "pointer", padding: "11px 16px",
              borderRadius: 10, fontWeight: 700, fontSize: 14, textAlign: "left",
              background: tab === key ? "rgba(255,255,255,0.18)" : "transparent",
              color: tab === key ? "#5ef7d2" : "rgba(255,255,255,0.75)",
              boxShadow: tab === key ? "inset 0 0 0 1.5px rgba(94,247,210,0.35)" : "none",
              transition: "all .18s",
            }}>{label}</button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2 }}>
            {ciudad === "TODAS" ? "Servicios totales" : ciudad.charAt(0) + ciudad.slice(1).toLowerCase()}
          </div>
          <div style={{ color: "#5ef7d2", fontWeight: 800, fontSize: 22, marginBottom: 14 }}>
            {(ciudad === "TODAS" ? portafolioActivo.length : portafolioActivo.filter(r => r.ciudad === ciudad).length).toLocaleString("es-CO")}
          </div>
          <button onClick={() => { setRol(null); setTab("buscar"); }} style={{
            width: "100%", border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer",
            padding: "9px", borderRadius: 10, fontWeight: 700, fontSize: 13,
            background: "transparent", color: "rgba(255,255,255,0.55)", transition: "all .18s",
          }}>🚪 Cerrar sesión</button>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{
          background: "#fff", borderBottom: "1.5px solid #e2e8f4",
          padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
          boxShadow: "0 2px 8px rgba(12,45,107,0.06)",
        }}>
          <div style={{ fontWeight: 800, color: "#0c2d6b", fontSize: 18 }}>
            {tabsDef.find(([k]) => k === tab)?.[1] ?? ""}
          </div>
          <div style={{ marginLeft: "auto", fontSize: 12, color: "#8a9ab8", fontWeight: 600 }}>
            Omnisalud · {rol === "admin" ? "Administrador" : "Servicio al Cliente"}
          </div>
        </div>

        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* ─── TAB AJUSTES ─────────────────────────────────────────── */}
          {tab === "ajustes" && (
            <div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", marginBottom: 14, boxShadow: "0 2px 8px rgba(10,40,90,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 800, color: "#0c2d6b", fontSize: 14 }}>Gestión de Portafolio</div>
                  <div style={{ fontSize: 12, color: "#6b7a99", marginTop: 2 }}>
                    {disabled.size > 0 ? <span style={{ color: "#e53935", fontWeight: 600 }}>⛔ {disabled.size} servicio{disabled.size !== 1 ? "s" : ""} inhabilitado{disabled.size !== 1 ? "s" : ""}</span> : <span style={{ color: "#1aab8a", fontWeight: 600 }}>✅ Todos habilitados</span>}
                  </div>
                </div>
                {disabled.size > 0 && (
                  <button onClick={() => setDisabled(new Set())} style={{ background: "#fff0f0", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#e53935", cursor: "pointer" }}>
                    Habilitar todos
                  </button>
                )}
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ position: "relative", flex: 2 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
                  <input ref={adjInputRef} value={adjQuery} onChange={(e) => setAdjQuery(e.target.value)}
                    placeholder="Buscar servicio o código…"
                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 40px 12px 42px", borderRadius: 12, border: "2px solid #e2e8f4", fontSize: 14, outline: "none", background: "#fff", color: "#0c2d6b", fontWeight: 500, boxShadow: "0 2px 8px rgba(10,40,90,0.06)" }}
                    onFocus={(e) => (e.target.style.border = "2px solid #1aab8a")}
                    onBlur={(e) => (e.target.style.border = "2px solid #e2e8f4")}
                  />
                  {adjQuery && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}><button onClick={() => setAdjQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7a99", fontSize: 18 }}>×</button></span>}
                </div>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>📍</span>
                  <select value={adjCiudad} onChange={(e) => setAdjCiudad(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", borderRadius: 12, border: "2px solid #e2e8f4", fontSize: 14, outline: "none", background: "#fff", color: adjCiudad === "TODAS" ? "#8a9ab8" : "#0c2d6b", fontWeight: 600, appearance: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(10,40,90,0.06)" }}
                    onFocus={(e) => (e.target.style.border = "2px solid #1aab8a")}
                    onBlur={(e) => (e.target.style.border = "2px solid #e2e8f4")}
                  >
                    {CIUDADES.map((c) => (<option key={c} value={c}>{c === "TODAS" ? `Todas las ciudades (${totalCiudades})` : c}</option>))}
                  </select>
                  <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 12, pointerEvents: "none", color: "#8a9ab8" }}>▾</span>
                </div>
              </div>

              {!adjQuery && adjCiudad === "TODAS" ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#8a9ab8" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>⚙️</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#4a5b7a" }}>Busca un servicio para gestionarlo</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>Usa el buscador o filtra por ciudad para ver los servicios.</div>
                </div>
              ) : resultadosAdj.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#8a9ab8" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>😔</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#4a5b7a" }}>Sin resultados</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 12, color: "#8a9ab8", marginBottom: 10, fontWeight: 600 }}>
                    {resultadosAdj.length} servicio{resultadosAdj.length !== 1 ? "s" : ""}{resultadosAdj.length === 80 ? " (mostrando primeros 80)" : ""}
                  </div>
                  {resultadosAdj.map((item, i) => {
                    const key = `${item.ciudad}|${item.codigo}`;
                    const isOff = disabled.has(key);
                    return (
                      <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", marginBottom: 8, boxShadow: "0 2px 8px rgba(10,40,90,0.07)", borderLeft: `4px solid ${isOff ? "#e0e5f0" : "#1aab8a"}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, opacity: isOff ? 0.6 : 1, transition: "all .2s" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#0c2d6b", lineHeight: 1.3, textDecoration: isOff ? "line-through" : "none" }}>{item.servicio}</div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#1aab8a", background: "#e8faf5", borderRadius: 20, padding: "2px 9px" }}>{item.codigo}</span>
                            <span style={{ fontSize: 11, fontWeight: 500, color: "#4a5b7a", background: "#f0f3fa", borderRadius: 20, padding: "2px 9px" }}>📍 {item.ciudad}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#0c2d6b", background: "#f0f3fa", borderRadius: 20, padding: "2px 9px" }}>{formatPrecio(item.precio)}</span>
                          </div>
                        </div>
                        <div onClick={() => toggleDisabled(key)} style={{ flexShrink: 0, width: 48, height: 26, borderRadius: 13, background: isOff ? "#e0e5f0" : "#1aab8a", cursor: "pointer", position: "relative", transition: "background .2s" }}>
                          <div style={{ position: "absolute", top: 3, left: isOff ? 3 : 23, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left .2s" }} />
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* ─── TAB BUSCAR ──────────────────────────────────────────── */}
          {tab === "buscar" && (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ position: "relative", flex: 2 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
                  <input
                    ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar servicio o código…"
                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 40px 12px 42px", borderRadius: 12, border: "2px solid #e2e8f4", fontSize: 14, outline: "none", background: "#fff", color: "#0c2d6b", fontWeight: 500, boxShadow: "0 2px 8px rgba(10,40,90,0.06)", transition: "border .2s" }}
                    onFocus={(e) => (e.target.style.border = "2px solid #1aab8a")}
                    onBlur={(e) => (e.target.style.border = "2px solid #e2e8f4")}
                  />
                  {query && (
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
                      <ClearBtn onClick={() => { setQuery(""); inputRef.current?.focus(); }} />
                    </span>
                  )}
                </div>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>📍</span>
                  <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", borderRadius: 12, border: "2px solid #e2e8f4", fontSize: 14, outline: "none", background: "#fff", color: ciudad === "TODAS" ? "#8a9ab8" : "#0c2d6b", fontWeight: 600, appearance: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(10,40,90,0.06)" }}
                    onFocus={(e) => (e.target.style.border = "2px solid #1aab8a")}
                    onBlur={(e) => (e.target.style.border = "2px solid #e2e8f4")}
                  >
                    {CIUDADES.map((c) => (
                      <option key={c} value={c}>
                        {c === "TODAS" ? `Todas las ciudades (${totalCiudades})` : c}
                      </option>
                    ))}
                  </select>
                  <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 12, pointerEvents: "none", color: "#8a9ab8" }}>▾</span>
                </div>
              </div>

              {!query && ciudad === "TODAS" ? (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#8a9ab8" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔎</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#4a5b7a", marginBottom: 6 }}>Busca un servicio</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    Escribe el nombre del servicio o su código,<br />o filtra por ciudad primero.
                  </div>
                </div>
              ) : resultados.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#8a9ab8" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>😔</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#4a5b7a" }}>Sin resultados</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>Intenta con otro nombre o cambia la ciudad.</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 12, color: "#8a9ab8", marginBottom: 10, fontWeight: 600 }}>
                    {resultados.length} resultado{resultados.length !== 1 ? "s" : ""}{resultados.length === 60 ? " (mostrando primeros 60)" : ""}
                  </div>
                  {resultados.map((item, i) => <ServiceCard key={i} item={item} query={query} />)}
                </>
              )}
            </>
          )}

          <div style={{ textAlign: "center", padding: "24px 0 8px", color: "#b0bbcc", fontSize: 11, borderTop: "1px solid #e8ecf4", marginTop: 24 }}>
            Omnisalud · Red Nacional de Proveedores · v1.0
          </div>
        </div>
      </div>
    </div>
  );
}

