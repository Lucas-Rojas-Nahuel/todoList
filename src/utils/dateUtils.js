import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function dateUtils(date) {
  const [year, month, day]= date.split("-").map(Number);
  const fecha = new Date(year, month - 1, day);
  const formato = format(fecha, "MMMM dd, 'del' yyyy", { locale: es });
  return formato;
}
