import { useState, useMemo, useEffect, useRef } from "react";
import { useServicios } from "./hooks/useServicios.js";
import { TopNav, FilterSheet, PasswordModal } from "./components/Chrome.jsx";
import { RedNacionalView } from "./views/RedNacionalView.jsx";
import { SedesPropiasView } from "./views/SedesPropiasView.jsx";
import { ParticularesView } from "./views/ParticularesView.jsx";
import { AjustesView } from "./views/AjustesView.jsx";
import { IconNetwork, IconBuilding, IconUser, IconSettings } from "./components/icons.js";
import logoUrl from "./assets/omnisalud-logo.jpg";

const PASSWORDS = { ajustes: "Costos2026*", sedes: "Omni123", "sedes-propias": "Omni123" };

const HEADINGS = {
  buscar: ["Red Nacional", "Explora tarifas y disponibilidad en tiempo real"],
  "sedes-propias": ["Sedes Propias", "Explora tarifas PYMES de sedes propias"],
  sedes: ["Particulares", "Explora tarifas particulares de sedes propias"],
  ajustes: ["Gestión de Portafolio", "Configura la visibilidad del catálogo nacional"],
};

const TABS = [
  ["buscar", <><IconNetwork size={16} /> Red Nacional</>],
  ["sedes-propias", <><IconBuilding size={16} /> Sedes Propias</>],
  ["sedes", <><IconUser size={16} /> Particulares</>],
  ["ajustes", <><IconSettings size={16} /> Ajustes</>],
];

export default function App() {
  const s = useServicios();

  const [rol, setRol] = useState("cliente");
  const [tab, setTab] = useState("buscar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);
  const [sedesUnlocked, setSedesUnlocked] = useState(false);
  const [pymesUnlocked, setPymesUnlocked] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (showPasswordModal) {
      setTimeout(() => passwordRef.current?.focus(), 100);
    }
  }, [showPasswordModal]);

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
    if (key === "sedes-propias" && !pymesUnlocked) {
      setPendingTab("sedes-propias");
      setShowPasswordModal(true);
      return;
    }
    setTab(key);
    setRol(key === "ajustes" ? "admin" : "cliente");
    setMenuOpen(false);
  };

  const closePassword = () => {
    setShowPasswordModal(false);
    setPasswordInput("");
    setPasswordError(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === PASSWORDS[pendingTab]) {
      closePassword();
      if (pendingTab === "sedes") {
        setSedesUnlocked(true);
        setTab("sedes");
        setRol("cliente");
      } else if (pendingTab === "sedes-propias") {
        setPymesUnlocked(true);
        setTab("sedes-propias");
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

  const [headTitle, headSub] = HEADINGS[tab] || HEADINGS.buscar;

  const isSedesTab = tab === "sedes" || tab === "sedes-propias";
  const currentSedesTotal = tab === "sedes-propias" ? s.totalPymes : s.totalSedes;
  const currentSedesPaq = tab === "sedes-propias" ? s.totalPymesPaquetes : s.totalPaquetes;
  const currentCiudadLabel = tab === "buscar"
    ? (s.ciudad === "TODAS" ? "Red" : s.ciudad)
    : (s.adjCiudad === "TODAS" ? "Red" : s.adjCiudad);
  const servicesInCity = useMemo(() => {
    const currentCiudad = tab === "buscar" ? s.ciudad : s.adjCiudad;
    const activePortafolio = s.portafolio.filter(r => r.active);
    if (currentCiudad === "TODAS") return activePortafolio.length;
    return activePortafolio.filter(r => r.ciudad === currentCiudad).length;
  }, [s.portafolio, s.ciudad, s.adjCiudad, tab]);

  const stats = { isSedesTab, currentSedesTotal, currentSedesPaq, currentCiudadLabel, servicesInCity, totalCiudades: s.totalCiudades, totalActivos: s.totalActivos, totalInactivos: s.totalInactivos, rol };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <a href="#main" className="skip-link">Saltar al contenido</a>

      <TopNav
        headTitle={headTitle}
        headSub={headSub}
        tabs={TABS}
        tab={tab}
        onSwitchTab={switchTab}
        stats={stats}
        menuOpen={menuOpen}
        onOpenMenu={() => setMenuOpen(true)}
        onCloseMenu={() => setMenuOpen(false)}
        logo={logoUrl}
      />

      <main id="main" style={{ flex: 1, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {s.loading && (
            <div style={{ background: "#e8faf5", color: "#0a5c4a", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 700 }}>Cargando tarifas…</div>
          )}
          {s.loadError && (
            <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 700 }}>{s.loadError}</div>
          )}

          {tab === "buscar" && <RedNacionalView s={s} />}
          {tab === "sedes-propias" && <SedesPropiasView s={s} />}
          {tab === "sedes" && <ParticularesView s={s} />}
          {tab === "ajustes" && <AjustesView s={s} />}

          <footer style={{ textAlign: "center", padding: "40px 0 20px", color: "#94a3b8", fontSize: 11, borderTop: "1px solid #e2e8f0", marginTop: 40 }}>
            Omnisalud S.A.S · Sistema de Red Nacional · Versión 1.2 · {new Date().getFullYear()}
          </footer>
        </div>
      </main>

      <FilterSheet s={s} tab={tab} stats={stats} />
      <PasswordModal
        show={showPasswordModal}
        pendingTab={pendingTab}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        setPasswordError={setPasswordError}
        passwordError={passwordError}
        onSubmit={handlePasswordSubmit}
        onClose={closePassword}
        passwordRef={passwordRef}
      />
    </div>
  );
}
