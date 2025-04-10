import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDate(dateStr: string) {
  return format(new Date(dateStr), "EEEE dd MMMM", { locale: fr });
}

export function formatDateTime(dateStr: string) {
  return format(new Date(dateStr), "EEEE dd MMMM à HH:mm", { locale: fr });
}
