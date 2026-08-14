import { SearchBar, FilterToolbar } from "../components/SearchBar.jsx";
import { SortControls, CitySelect, EmptyState } from "../components/ui.jsx";
import { ServiceCard } from "../components/ServiceCard.jsx";
import { IconSearch, IconFrown } from "../components/icons.js";

export function RedNacionalView({ s }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SearchBar query={s.query} onQueryChange={s.setQuery}>
        <FilterToolbar onOpenFilter={s.openFilter}>
          <div style={{ width: 200 }}>
            <CitySelect value={s.ciudad} onChange={(e) => s.setCiudad(e.target.value)} ciudades={s.ciudades} />
          </div>
          <SortControls handleSortAlpha={s.handleSortAlpha} handleSortPrice={s.handleSortPrice} sortAlpha={s.sortAlpha} sortPrice={s.sortPrice} />
        </FilterToolbar>
      </SearchBar>

      <div>
        {!s.query && s.ciudad === "TODAS" ? (
          <EmptyState dashed icon={<IconSearch size={40} color="#94a3b8" />} title="Comienza tu búsqueda" subtitle="Ingresa un término o selecciona una ciudad para ver resultados." />
        ) : s.resultados.length === 0 ? (
          <EmptyState icon={<IconFrown size={32} color="#94a3b8" />} title="No encontramos coincidencias" subtitle="Prueba con otros términos o verifica los filtros." />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
              <span style={{ fontSize: 12, color: "#6b7a99", fontWeight: 700 }}>MOSTRANDO {s.resultados.length} RESULTADOS</span>
            </div>
            {s.resultados.map((item, i) => <ServiceCard key={i} item={item} query={s.query} />)}
          </>
        )}
      </div>
    </div>
  );
}
