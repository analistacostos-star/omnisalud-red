import { IconHamburger, IconClose } from "./icons.js";
import { StatBadge, SortControls, CitySelect, PaqSelect } from "./ui.jsx";

export function TopNav({ headTitle, headSub, tabs, tab, onSwitchTab, stats, menuOpen, onOpenMenu, onCloseMenu, logo }) {
  const { isSedesTab, currentSedesTotal, currentSedesPaq, currentCiudadLabel, servicesInCity, totalCiudades, totalActivos, totalInactivos, rol } = stats;

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#0c2d6b", borderBottom: "1px solid rgba(255,255,255,0.1)", width: "100%",
      }}>
        <div className="nav-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(8px, 3vw, 24px)", minHeight: "clamp(52px, 16vw, 64px)", display: "flex", alignItems: "center", gap: "clamp(6px, 3vw, 24px)" }}>
          <div className="nav-logo-wrap" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <img src={logo} alt="Omnisalud" height={32} width="auto" style={{ objectFit: "contain", mixBlendMode: "screen" }} />
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 12 }}>
              <h1 className="nav-title-text" style={{ fontSize: "clamp(11px, 3.5vw, 14px)", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                {headTitle}
              </h1>
              <p className="nav-subtitle" style={{ fontSize: "clamp(8px, 2.5vw, 10px)", color: "rgba(255,255,255,0.5)", margin: "2px 0 0", lineHeight: 1.2 }}>
                {headSub}
              </p>
            </div>
          </div>

          <nav className="nav-desktop-tabs" aria-label="Navegación principal">
            {tabs.map(([key, label]) => (
              <button key={key} onClick={() => onSwitchTab(key)} style={{
                border: "none", cursor: "pointer", height: 40, padding: "0 16px",
                borderRadius: 8, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8,
                background: tab === key ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === key ? "#fff" : "rgba(255,255,255,0.6)",
                transition: "all .2s",
              }}>{label}</button>
            ))}
          </nav>

          <div className="nav-desktop-only" style={{ marginLeft: "auto", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {isSedesTab ? (
              <>
                <StatBadge label="Total Servicios" value={currentSedesTotal.toLocaleString()} />
                <StatBadge label="Paquetes" value={currentSedesPaq.toLocaleString()} color="#1aab8a" />
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

          <div className="nav-mobile-only" style={{ marginLeft: "auto", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div className="nav-mobile-badge" style={{
              background: "rgba(255,255,255,0.1)", padding: "clamp(4px, 1.5vw, 6px) clamp(8px, 2vw, 12px)", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)", textAlign: "right",
            }}>
              <div style={{ fontSize: "clamp(7px, 2vw, 9px)", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Total Servicios</div>
              <div style={{ fontSize: "clamp(12px, 3.5vw, 14px)", fontWeight: 800, color: "#fff" }}>{(isSedesTab ? currentSedesTotal : totalActivos).toLocaleString()}</div>
            </div>
            <button
              className="hamburger-btn"
              onClick={onOpenMenu}
              aria-label="Abrir menú de navegación"
            >
              <IconHamburger size={22} color="#fff" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <div className="overlay" onClick={onCloseMenu} aria-hidden="true" />
          <div className="menu-drawer" role="dialog" aria-label="Menú de navegación">
            <div className="menu-drawer-header">
              <h3>Menú</h3>
              <button onClick={onCloseMenu} className="hamburger-btn" aria-label="Cerrar menú">
                <IconClose size={20} color="#fff" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
              {tabs.map(([key, label]) => (
                <button key={key} onClick={() => onSwitchTab(key)} style={{
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
    </>
  );
}

export function FilterSheet({ s, tab, stats }) {
  const { isSedesTab, currentSedesTotal, currentSedesPaq, servicesInCity, currentCiudadLabel, totalCiudades } = stats;

  if (!s.filterOpen) return null;

  return (
    <>
      <div className="overlay" onClick={s.closeFilter} aria-hidden="true" />
      <div className="filter-sheet" role="dialog" aria-label="Filtros">
        <div className="filter-sheet-header">
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0c2d6b", margin: 0 }}>Filtros</h3>
          <button onClick={s.closeFilter} style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }} aria-label="Cerrar filtros">
            <IconClose size={20} color="#6b7a99" />
          </button>
        </div>

        <div className="filter-sheet-section">
          <div className="filter-sheet-label">{isSedesTab ? "Tipo" : "Ciudad"}</div>
          {tab === "buscar" ? (
            <CitySelect value={s.ciudad} onChange={(e) => { s.setCiudad(e.target.value); s.closeFilter(); }} ciudades={s.ciudades} />
          ) : tab === "sedes" ? (
            <PaqSelect value={s.sedesFilter} onChange={(e) => { s.setSedesFilter(e.target.value); s.closeFilter(); }} />
          ) : tab === "sedes-propias" ? (
            <PaqSelect value={s.pymesFilter} onChange={(e) => { s.setPymesFilter(e.target.value); s.closeFilter(); }} />
          ) : (
            <CitySelect value={s.adjCiudad} onChange={(e) => { s.setAdjCiudad(e.target.value); s.closeFilter(); }} ciudades={s.ciudades} />
          )}
        </div>

        <div className="filter-sheet-section">
          <div className="filter-sheet-label">Orden</div>
          <SortControls
            handleSortAlpha={s.handleSortAlpha}
            handleSortPrice={s.handleSortPrice}
            sortAlpha={s.sortAlpha}
            sortPrice={s.sortPrice}
            onlyInactive={tab === "ajustes" ? s.onlyInactive : null}
            setOnlyInactive={tab === "ajustes" ? s.setOnlyInactive : null}
            vertical
          />
        </div>

        <div className="filter-sheet-section" style={{ marginTop: 16 }}>
          <div className="filter-sheet-label">Estadísticas</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 auto", background: "#f8fafc", padding: "12px 14px", borderRadius: 8, border: "1px solid #eef1f6", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0c2d6b" }}>{(isSedesTab ? currentSedesTotal : servicesInCity).toLocaleString()}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginTop: 2 }}>{isSedesTab ? "Servicios" : `Servicios ${currentCiudadLabel}`}</div>
            </div>
            <div style={{ flex: "1 1 auto", background: "#f8fafc", padding: "12px 14px", borderRadius: 8, border: "1px solid #eef1f6", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1aab8a" }}>{isSedesTab ? currentSedesPaq : totalCiudades}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginTop: 2 }}>{isSedesTab ? "Paquetes" : "Ciudades"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function PasswordModal({ show, pendingTab, passwordInput, setPasswordInput, setPasswordError, passwordError, onSubmit, onClose, passwordRef }) {
  if (!show) return null;

  const targetLabel = pendingTab === "sedes" ? "acceder a Particulares" : pendingTab === "sedes-propias" ? "acceder a Sedes Propias" : "acceder al panel de ajustes";

  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <div className="password-modal" role="dialog" aria-label="Autenticación requerida">
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0c2d6b" }}>Acceso Restringido</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7a99" }}>Ingresa la contraseña para {targetLabel}</p>
          </div>
          <input
            ref={passwordRef}
            type="password"
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
            placeholder="Contraseña"
            aria-label="Contraseña"
            autoFocus
            style={{
              width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 8,
              border: `1.5px solid ${passwordError ? "#ef4444" : "#eef1f6"}`,
              fontSize: 14, background: "#f8fafc", color: "#0c2d6b", marginBottom: passwordError ? 4 : 12,
            }}
          />
          {passwordError && (
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "#ef4444", fontWeight: 600 }}>Contraseña incorrecta</p>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose}
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
  );
}
