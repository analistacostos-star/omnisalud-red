import { SearchBar, FilterToolbar } from "../components/SearchBar.jsx";
import { SortControls, PaqSelect, EmptyState } from "../components/ui.jsx";
import { ServiceCard } from "../components/ServiceCard.jsx";
import { IconFrown } from "../components/icons.js";

export function SedesPropiasView({ s }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SearchBar query={s.pymesQuery} onQueryChange={s.setPymesQuery}>
        <FilterToolbar onOpenFilter={s.openFilter}>
          <div style={{ width: 200 }}>
            <PaqSelect value={s.pymesFilter} onChange={(e) => s.setPymesFilter(e.target.value)} />
          </div>
          <SortControls handleSortAlpha={s.handleSortAlpha} handleSortPrice={s.handleSortPrice} sortAlpha={s.sortAlpha} sortPrice={s.sortPrice} />
        </FilterToolbar>
      </SearchBar>

      <div>
        {s.resultadosPymes.length === 0 ? (
          <EmptyState icon={<IconFrown size={32} color="#94a3b8" />} title="No encontramos coincidencias" subtitle="Prueba con otros términos o verifica los filtros." />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
              <span style={{ fontSize: 12, color: "#6b7a99", fontWeight: 700 }}>MOSTRANDO {s.resultadosPymes.length} RESULTADOS</span>
            </div>
            {s.resultadosPymes.map((item, i) => <ServiceCard key={i} item={item} query={s.pymesQuery} nombrePorCodigo={s.nombrePorCodigo} />)}
          </>
        )}
      </div>
    </div>
  );
}
