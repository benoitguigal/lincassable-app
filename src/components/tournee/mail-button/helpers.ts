import { format } from "date-fns";
import { fr } from "date-fns/locale";
import mail from "./mail.html?raw";
import nunjucks from "nunjucks";
import { PointDeCollecte } from "../../../types";
import { getPointDeCollecteFormulaireUrl } from "../../../utility/urls";

type RenderMailProps = {
  dateLimit: string;
  dateTournee: string;
  pointDeCollecte: PointDeCollecte;
};

function formatDate(dateStr: string) {
  return format(new Date(dateStr), "EEEE dd MMMM", { locale: fr });
}

export function renderMail({
  dateLimit,
  dateTournee,
  pointDeCollecte,
}: RenderMailProps) {
  return nunjucks.renderString(mail, {
    dateTournee: formatDate(dateTournee),
    dateLimit: formatDate(dateLimit),
    lienFormulaire: getPointDeCollecteFormulaireUrl(pointDeCollecte),
  });
}
