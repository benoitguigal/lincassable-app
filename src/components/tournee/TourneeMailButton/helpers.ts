import mail from "./mail.html?raw";
import nunjucks from "nunjucks";
import { PointDeCollecte } from "../../../types";
import { getPointDeCollecteFormulaireRemplissageUrl } from "../../../utility/urls";
import { formatDate } from "../../../utility/dateFormat";

type RenderMailProps = {
  dateLimit: string;
  dateTournee: string;
  pointDeCollecte: PointDeCollecte;
};

export function renderMail({
  dateLimit,
  dateTournee,
  pointDeCollecte,
}: RenderMailProps) {
  return nunjucks.renderString(mail, {
    dateTournee: formatDate(dateTournee),
    dateLimit: formatDate(dateLimit),
    lienFormulaire: getPointDeCollecteFormulaireRemplissageUrl(pointDeCollecte),
  });
}
