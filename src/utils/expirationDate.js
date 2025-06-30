import { format, isBefore, isValid, parse } from "date-fns";
import { es } from "date-fns/locale";

export default function expirationDate(expirationDate, today) {
  if (typeof expirationDate !== "string") {
    console.warn("Valor no válido para expirationDate:", expirationDate);
    return false;
  }
  const fecha = parse(expirationDate, "MMMM dd, 'del' yyyy", new Date(), {
    locale: es,
  });

  if (isValid(fecha)) {
    // Comparación correcta usando Date
    return isBefore(fecha, today); // ✅ Ambos son objetos Date
  } else {
    return false;
  }
}
