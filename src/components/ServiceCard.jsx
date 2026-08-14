import { useState } from "react";
import { COMPOSICION_PAQUETES } from "../data/paquetes.js";
import { normalize, formatPrecio } from "../lib/format.js";
import { IconLocation, IconChevron } from "./icons.js";

function Highlight({ text, query }) {
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
}

export function ServiceCard({ item, query, nombrePorCodigo = {}, selectable = false, checked = false, onToggle }) {
  const composicion = COMPOSICION_PAQUETES[item.codigo];
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: "#fff", borderRadius: 10, marginBottom: 8,
      boxShadow: "0 1px 3px rgba(10,40,90,0.05)",
      border: checked ? "1px solid #1aab8a" : "1px solid #eef1f6", borderLeft: "4px solid #1aab8a",
      overflow: "hidden",
    }}>
      <div
        onClick={composicion ? () => setOpen((v) => !v) : undefined}
        style={{
          padding: "12px 16px", display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: 16, cursor: composicion ? "pointer" : "default",
        }}
      >
        {selectable && (
          <input
            type="checkbox"
            checked={checked}
            onClick={(e) => e.stopPropagation()}
            onChange={onToggle}
            aria-label={`Seleccionar ${item.servicio || item.codigo}`}
            style={{ width: 18, height: 18, accentColor: "#1aab8a", cursor: "pointer", flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0c2d6b", lineHeight: 1.2, marginBottom: 4 }}>
            <Highlight text={item.servicio || item.codigo} query={query} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#1aab8a", background: "#e8faf5", borderRadius: 4, padding: "1px 6px", textTransform: "uppercase" }}>
              {item.codigo}
            </span>
            {composicion && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7a99" }}>
                {composicion.length} servicios
              </span>
            )}
            {item.ciudad && (
              <span style={{ fontSize: 11, fontWeight: 500, color: "#6b7a99", display: "flex", alignItems: "center", gap: 4 }}>
                <IconLocation size={12} color="#94a3b8" /> {item.ciudad}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0c2d6b", letterSpacing: "-0.01em" }}>
            {formatPrecio(item.precio)}
          </div>
          {composicion && (
            <span style={{ display: "flex", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "#94a3b8" }}>
              <IconChevron size={16} />
            </span>
          )}
        </div>
      </div>

      {composicion && open && (
        <div style={{ borderTop: "1px solid #eef1f6", background: "#f8fafc", padding: "8px 16px 10px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", margin: "4px 0 6px" }}>
            Composición del paquete
          </div>
          {composicion.map((codigo) => (
            <div key={codigo} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#1aab8a", background: "#e8faf5", borderRadius: 4, padding: "1px 5px", textTransform: "uppercase", flexShrink: 0 }}>
                {codigo}
              </span>
              <span style={{ fontSize: 12, color: "#4a5b7a" }}>{nombrePorCodigo[codigo] || codigo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
