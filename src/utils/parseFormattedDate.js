import { parse, isValid, format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Convierte una fecha formateada (ej: "junio 25, del 2025")
 * al formato "yyyy-MM-dd" para usar en inputs type="date".
 * @param {string} formattedFecha
 * @returns {string|null} formato ISO compatible con input date o null si es inválido
 */
export default function parseFormattedDateToInput(formattedFecha) {
  const fecha = parse(formattedFecha, "MMMM dd, 'del' yyyy", new Date(), {
    locale: es,
  });

  return isValid(fecha) ? format(fecha, "yyyy-MM-dd") : null;
}
