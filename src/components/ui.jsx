import { IconLocation, IconFilter, IconSortAZ, IconSortPrice, IconEye, IconEyeOff } from "./icons.js";

export function ClearBtn({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Limpiar" style={{ background: "none", border: "none", cursor: "pointer", padding: "0 6px", color: "#6b7a99", fontSize: 20, lineHeight: 1, display: "flex", alignItems: "center" }}>
      ×
    </button>
  );
}

export function StatBadge({ label, value, color, variant }) {
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

export function SortControls({ handleSortAlpha, handleSortPrice, sortAlpha, sortPrice, onlyInactive, setOnlyInactive, vertical }) {
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

export function CitySelect({ value, onChange, ciudades }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex", zIndex: 1 }}>
        <IconLocation size={14} color="#94a3b8" />
      </span>
      <select value={value} onChange={onChange} aria-label="Ciudad" style={{
        width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 38px",
        borderRadius: 8, border: "1.5px solid #eef1f6", fontSize: 14, fontWeight: 600,
        appearance: "none", background: "#f8fafc", color: "#0c2d6b", cursor: "pointer",
      }}>
        {ciudades.map((c) => (<option key={c} value={c}>{c === "TODAS" ? "Todas las ciudades" : c}</option>))}
      </select>
    </div>
  );
}

export function PaqSelect({ value, onChange }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex", zIndex: 1 }}>
        <IconFilter size={14} color="#94a3b8" />
      </span>
      <select value={value} onChange={onChange} aria-label="Tipo de servicio" style={{
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

export function EmptyState({ icon, title, subtitle, dashed = false }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", ...(dashed ? { background: "#fff", borderRadius: 12, border: "1px dashed #cbd5e1" } : {}) }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>{icon}</div>
      <h3 style={{ margin: 0, color: "#4a5b7a" }}>{title}</h3>
      <p style={{ color: "#8a9ab8", fontSize: 14 }}>{subtitle}</p>
    </div>
  );
}
