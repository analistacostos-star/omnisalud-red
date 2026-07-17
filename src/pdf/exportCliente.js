import logoSvg from "../assets/omni-logo.svg?raw";
import { COMPOSICION_PAQUETES } from "../data/paquetes.js";

// ponytail: lazy-load pdfmake (~1.5MB) so it only ships when the user exports.
let pdfMakePromise;
async function getPdfMake() {
  if (!pdfMakePromise) {
    pdfMakePromise = Promise.all([
      import("pdfmake/build/pdfmake"),
      import("pdfmake/build/vfs_fonts"),
    ]).then(([pm, fontsMod]) => {
      const pdfMake = pm.default || pm;
      // pdfmake 0.3.x keeps an internal virtual fs; must register, not assign .vfs
      const vfs = fontsMod.default?.vfs || fontsMod.vfs || fontsMod.default || fontsMod;
      pdfMake.addVirtualFileSystem(vfs);
      return pdfMake;
    });
  }
  return pdfMakePromise;
}

const AZUL = "#0c2d6b";
const GRIS = "#6b7a99";
const SEP = "#6f9fd0"; // separador azul claro en el footer

// Logo monocromo en azul corporativo (el SVG trae paths magenta y blancos).
const logoAzul = logoSvg.replace(/fill="[^"]*"/gi, `fill="${AZUL}"`);

// Banda corporativa full-width (azul) para el header.
const banner = (w) => ({
  canvas: [{ type: "rect", x: 0, y: 0, w, h: 8, color: AZUL }],
});

const money = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);

const esPaquete = (codigo) => (codigo || "").toUpperCase().startsWith("PAQ");

const sanitize = (s) =>
  (s || "").trim().replace(/\s+/g, "_").replace(/[^\w.-]/g, "") || "documento";

// items: [{ codigo, servicio, precio }], nombrePorCodigo: { codigo: nombre }
export async function generarPdfCliente(cliente, items, nombrePorCodigo = {}) {
  const pdfMake = await getPdfMake();
  const total = items.reduce((acc, it) => acc + (Number(it.precio) || 0), 0);

  // Sección 2: filas de servicios seleccionados
  const filasServicios = [];
  items.forEach((it) => {
    filasServicios.push([
      { text: it.codigo, style: "servCodigo" },
      { text: it.servicio || it.codigo, style: "servNombre" },
      { text: money(it.precio), style: "servPrecio" },
    ]);
    if (esPaquete(it.codigo)) {
      const comp = COMPOSICION_PAQUETES[it.codigo] || [];
      const desglose = comp
        .map((c) => `•  ${nombrePorCodigo[c] || c}  (${c})`)
        .join("\n");
      if (desglose) {
        filasServicios.push([
          { text: `Incluye:\n${desglose}`, style: "desglose", colSpan: 3 },
          {}, {},
        ]);
      }
    }
  });

  const docDefinition = {
    pageSize: "LETTER",
    pageMargins: [48, 96, 48, 52],

    header: (currentPage, pageCount, pageSize) => ({
      stack: [
        banner(pageSize.width),
        { svg: logoAzul, width: 120, margin: [48, 14, 48, 0] },
      ],
    }),

    footer: (currentPage, pageCount) => ({
      margin: [0, 22, 0, 0],
      table: {
        widths: ["*"],
        body: [[{
          fillColor: AZUL,
          margin: [40, 8, 40, 8],
          columns: [
            {
              width: "*",
              fontSize: 6.5,
              color: "#fff",
              text: [
                { text: "Medellín - Rionegro ", bold: true }, { text: "(604) 448 1044" },
                { text: "  |  ", color: SEP },
                { text: "Bogotá ", bold: true }, { text: "(601) 482 3258" },
                { text: "  |  ", color: SEP },
                { text: "Cali - Palmira ", bold: true }, { text: "(602) 386 5150" },
                { text: "  |  ", color: SEP },
                { text: "Red nacional ", bold: true }, { text: "(604) 448 1044" },
              ],
            },
            {
              width: "auto",
              fontSize: 6.5,
              color: "#fff",
              alignment: "right",
              text: [
                { text: "www.omnisalud.co", bold: true },
                { text: "  |  ", color: SEP },
                { text: `Pág. ${currentPage} / ${pageCount}` },
              ],
            },
          ],
        }]],
      },
      layout: {
        defaultBorder: false,
        paddingLeft: () => 0, paddingRight: () => 0,
        paddingTop: () => 0, paddingBottom: () => 0,
      },
    }),

    content: [
      // ── Sección 1: Información del Cliente ──
      { text: "1.  Información del Cliente", style: "seccion" },
      {
        table: {
          widths: [140, "*"],
          body: [
            [{ text: "Nombre", style: "etiqueta" }, { text: cliente.nombre || "—", style: "valor" }],
            [{ text: "Documento", style: "etiqueta" }, { text: cliente.documento || "—", style: "valor" }],
            [{ text: "Correo electrónico", style: "etiqueta" }, { text: cliente.correo || "—", style: "valor" }],
            [{ text: "Teléfono", style: "etiqueta" }, { text: cliente.telefono || "—", style: "valor" }],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 20],
      },

      // ── Sección 2: Servicios seleccionados ──
      { text: "2.  Tarifas de los servicios", style: "seccion" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto"],
          body: [
            [
              { text: "Código", style: "th" },
              { text: "Servicio", style: "th" },
              { text: "Tarifa", style: "th", alignment: "right" },
            ],
            ...filasServicios,
          ],
        },
        layout: {
          hLineColor: "#eef1f6",
          vLineColor: "#eef1f6",
          hLineWidth: () => 0.5,
          vLineWidth: () => 0,
          paddingTop: () => 6,
          paddingBottom: () => 6,
        },
      },
      {
        table: {
          widths: ["*", "auto"],
          body: [[
            { text: "TOTAL", style: "totalLabel" },
            { text: money(total), style: "totalValor" },
          ]],
        },
        layout: "noBorders",
        margin: [0, 8, 0, 20],
      },

      // ── Nota de pago (card) ──
      {
        table: {
          widths: ["*"],
          body: [[{
            stack: [
              { text: "Forma de pago", bold: true, color: AZUL, fontSize: 11, margin: [0, 0, 0, 4] },
              {
                text: "Los pagos de los servicios seleccionados se realizan de forma segura a través de la pasarela de pagos Wompi. Una vez confirmada la cotización, recibirá el enlace de pago correspondiente para completar la transacción.",
                style: "parrafo",
              },
            ],
            fillColor: "#f4f7fc",
          }]],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: (i) => (i === 0 ? 3 : 0),
          vLineColor: () => AZUL,
          paddingLeft: () => 14, paddingRight: () => 14,
          paddingTop: () => 12, paddingBottom: () => 12,
        },
      },
    ],

    styles: {
      seccion: { fontSize: 13, bold: true, color: AZUL, margin: [0, 0, 0, 8] },
      etiqueta: { fontSize: 10, bold: true, color: GRIS },
      valor: { fontSize: 10, color: "#1f2937" },
      th: { fontSize: 9, bold: true, color: "#fff", fillColor: AZUL, margin: [2, 2, 2, 2] },
      servNombre: { fontSize: 10, color: "#1f2937", bold: true },
      servCodigo: { fontSize: 9, color: AZUL, bold: true },
      servPrecio: { fontSize: 10, color: AZUL, bold: true, alignment: "right" },
      desglose: { fontSize: 8, color: GRIS, italics: true, margin: [8, 0, 0, 2] },
      totalLabel: { fontSize: 12, bold: true, color: AZUL, alignment: "right" },
      totalValor: { fontSize: 12, bold: true, color: AZUL, alignment: "right", margin: [16, 0, 0, 0] },
      parrafo: { fontSize: 10, color: "#374151", lineHeight: 1.4 },
    },
  };

  const filename = `${sanitize(cliente.documento)}_${sanitize(cliente.nombre)}.pdf`;
  pdfMake.createPdf(docDefinition).download(filename);
}
