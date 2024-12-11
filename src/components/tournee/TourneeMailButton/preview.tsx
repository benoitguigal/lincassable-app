import { PointDeCollecte } from "../../../types";
import { renderMail } from "./helpers";

export type TourneeMailPreviewProps = {
  // Point de collecte
  pointDeCollecte: PointDeCollecte;
  // Date prévisionnel de la tournée
  dateTournee: string;
  // Date limite pour répondre au formulaire
  dateLimit: string;
};

const TourneeMailPreview: React.FC<TourneeMailPreviewProps> = ({
  pointDeCollecte,
  dateTournee,
  dateLimit,
}) => {
  const email = pointDeCollecte.emails[0] ?? "";

  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
        padding: 20,
      }}
    >
      <div style={{ marginBottom: 5 }}>Pour : {email}</div>
      <div
        dangerouslySetInnerHTML={{
          __html: renderMail({ dateTournee, dateLimit, pointDeCollecte }),
        }}
      ></div>
    </div>
  );
};

export default TourneeMailPreview;
