import { SearchBar, FilterToolbar } from "../components/SearchBar.jsx";
import { SortControls, CitySelect, EmptyState } from "../components/ui.jsx";
import { IconFrown, IconSettings, IconLocation } from "../components/icons.js";
import { formatPrecio } from "../lib/format.js";

export function AjustesView({ s }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SearchBar query={s.adjQuery} onQueryChange={s.setAdjQuery} placeholder="Filtrar servicios...">
        <FilterToolbar onOpenFilter={s.openFilter}>
          <div style={{ width: 200 }}>
            <CitySelect value={s.adjCiudad} onChange={(e) => s.setAdjCiudad(e.target.value)} ciudades={s.ciudades} />
          </div>
          <SortControls handleSortAlpha={s.handleSortAlpha} handleSortPrice={s.handleSortPrice} sortAlpha={s.sortAlpha} sortPrice={s.sortPrice} onlyInactive={s.onlyInactive} setOnlyInactive={s.setOnlyInactive} />
        </FilterToolbar>
      </SearchBar>

      <div>
        {!s.adjQuery && s.adjCiudad === "TODAS" && !s.onlyInactive ? (
          <EmptyState icon={<IconSettings size={40} color="#94a3b8" />} title="Panel de Gestión" subtitle="Busca un servicio o activa el filtro de inactivos para gestionar." />
        ) : s.resultadosAdj.length === 0 ? (
          <EmptyState icon={<IconFrown size={32} color="#94a3b8" />} title="No encontramos coincidencias" subtitle="Prueba con otros términos o verifica los filtros." />
        ) : (
          <>
            <div style={{ marginBottom: 12, padding: "0 4px" }}>
              <span style={{ fontSize: 12, color: "#6b7a99", fontWeight: 700 }}>{s.resultadosAdj.length} ENCONTRADOS {s.onlyInactive ? "(INACTIVOS)" : ""}</span>
            </div>
            {s.resultadosAdj.map((item, i) => {
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
                  <button
                    role="switch"
                    aria-checked={!isOff}
                    aria-label={`${item.servicio || item.codigo}: ${isOff ? "inactivo" : "activo"}`}
                    onClick={() => s.toggleActive(item.id, item.active)}
                    style={{ flexShrink: 0, width: 44, height: 24, borderRadius: 12, background: isOff ? "#cbd5e1" : "#1aab8a", cursor: "pointer", position: "relative", transition: "all 0.2s", border: "none", padding: 0 }}
                  >
                    <div style={{ position: "absolute", top: 3, left: isOff ? 3 : 23, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "left 0.2s" }} />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
