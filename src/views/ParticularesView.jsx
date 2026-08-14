import { SearchBar, FilterToolbar } from "../components/SearchBar.jsx";
import { SortControls, PaqSelect, EmptyState } from "../components/ui.jsx";
import { ServiceCard } from "../components/ServiceCard.jsx";
import { IconFrown, IconPdf } from "../components/icons.js";

const CLIENTE_FIELDS = [
  ["nombre", "Nombre Cliente", "text"],
  ["documento", "Número de Documento", "text"],
  ["correo", "Correo electrónico", "email"],
  ["telefono", "Número de teléfono", "tel"],
];

export function ParticularesView({ s }) {
  const seleccionLabel = `${s.seleccionados.size} servicio${s.seleccionados.size === 1 ? "" : "s"} seleccionado${s.seleccionados.size === 1 ? "" : "s"}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SearchBar query={s.sedesQuery} onQueryChange={s.setSedesQuery}>
        <FilterToolbar onOpenFilter={s.openFilter}>
          <div style={{ width: 200 }}>
            <PaqSelect value={s.sedesFilter} onChange={(e) => s.setSedesFilter(e.target.value)} />
          </div>
          <SortControls handleSortAlpha={s.handleSortAlpha} handleSortPrice={s.handleSortPrice} sortAlpha={s.sortAlpha} sortPrice={s.sortPrice} />
        </FilterToolbar>
      </SearchBar>

      {/* Datos del cliente + exportar */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: 12, boxShadow: "0 4px 12px rgba(10,40,90,0.04)", border: "1px solid #eef1f6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase" }}>Datos del cliente</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#6b7a99" }}>{seleccionLabel}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          {CLIENTE_FIELDS.map(([key, label, type]) => (
            <input
              key={key}
              type={type}
              value={s.cliente[key]}
              onChange={(e) => s.setCliente((c) => ({ ...c, [key]: e.target.value }))}
              placeholder={label}
              aria-label={label}
              style={{ flex: "1 1 180px", minWidth: 0, boxSizing: "border-box", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, background: "#f8fafc", color: "#0c2d6b" }}
            />
          ))}
          <button
            onClick={s.exportarPdf}
            disabled={!s.puedeExportar}
            aria-label="Generar PDF"
            title={!s.clienteCompleto ? "Complete todos los campos" : s.seleccionados.size === 0 ? "Seleccione al menos un servicio" : "Generar PDF"}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              width: 46, height: 46, borderRadius: 8, border: "none",
              color: "#fff", background: s.puedeExportar ? "#1aab8a" : "#c3ccdb",
              cursor: s.puedeExportar ? "pointer" : "not-allowed",
            }}
          >
            <IconPdf size={20} />
          </button>
        </div>
      </div>

      <div>
        {s.resultadosSedes.length === 0 ? (
          <EmptyState icon={<IconFrown size={32} color="#94a3b8" />} title="No encontramos coincidencias" subtitle="Prueba con otros términos o verifica los filtros." />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
              <span style={{ fontSize: 12, color: "#6b7a99", fontWeight: 700 }}>MOSTRANDO {s.resultadosSedes.length} RESULTADOS</span>
            </div>
            {s.resultadosSedes.map((item, i) => <ServiceCard key={i} item={item} query={s.sedesQuery} nombrePorCodigo={s.nombrePorCodigo} selectable checked={s.seleccionados.has(item.codigo)} onToggle={() => s.toggleSeleccion(item.codigo)} />)}
          </>
        )}
      </div>
    </div>
  );
}
