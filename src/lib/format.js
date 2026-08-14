export const normalize = (str) =>
  (str || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const formatPrecio = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
