import { useRef } from "react";
import { IconSearch, IconFilter } from "./icons.js";
import { ClearBtn } from "./ui.jsx";

export function FilterToolbar({ onOpenFilter, children }) {
  return (
    <>
      <div className="filter-desktop" style={{ gap: 12, alignItems: "center" }}>{children}</div>
      <div className="filter-mobile-btn">
        <button className="filter-mob-btn" onClick={onOpenFilter} aria-label="Abrir filtros">
          <IconFilter size={16} /> Filtros
        </button>
      </div>
    </>
  );
}

export function SearchBar({ query, onQueryChange, placeholder = "Buscar por nombre o código...", children }) {
  const inputRef = useRef(null);
  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: 12, boxShadow: "0 4px 12px rgba(10,40,90,0.04)", border: "1px solid #eef1f6", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}><IconSearch size={16} color="#94a3b8" /></span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, background: "#f8fafc", color: "#0c2d6b" }}
        />
        {query && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}><ClearBtn onClick={() => { onQueryChange(""); inputRef.current?.focus(); }} /></span>}
      </div>
      {children}
    </div>
  );
}
