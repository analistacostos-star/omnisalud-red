// Composición de paquetes: solo los códigos que lo componen.
// El nombre de cada servicio se resuelve por match contra los datos del back.
export const COMPOSICION_PAQUETES = {
  "PAQ-00": ["MD-1", "FN-1", "OPTO-2"],
  "PAQ-99": ["MD-1", "FN-1", "OPTO-1"],
  "PAQ-1": ["MD-1", "LAB-4", "LAB-7", "LAB-3"],
  "PAQ-7": ["MD-4", "FN-11", "OPTO-11", "LAB-98", "LAB-97"],
  "PAQ-5": ["LAB-98", "OPTO-14", "FN-11", "LAB-97", "MD-4"],
  "PAQ-17": ["FN-1", "MD-1", "PSICO-1", "OPTO-1"],
};

// Códigos que no deben mostrarse como cards en 'Particulares'
// (antes se excluían en el repository con un NOT IN; ahora se filtran aquí
//  para que sigan siendo consultables desde el back).
export const HIDDEN_SEDES_CODES = new Set([
  "PAQ-9", "FN-11", "OPTO-14", "LAB-98", "LAB-97", "OPTO-11", "MD-5",
  "MD-4", "LAB-58", "OPTO-2",
]);
