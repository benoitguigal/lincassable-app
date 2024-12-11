import { Result } from "antd";
import { useSearchParams } from "react-router-dom";

const DemandeDeCollecteSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();

  const demandeCollecte = searchParams.get("demande_collecte");

  const title =
    demandeCollecte === "true"
      ? "Votre demande de collecte a bien été prise en compte"
      : "Votre taux de remplissage a bien été pris en compte";

  const subTitle =
    demandeCollecte === "true"
      ? "Nous reviendrons vers vous rapidement avec une date de collecte"
      : "";

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Result status="success" title={title} subTitle={subTitle} />
    </div>
  );
};

export default DemandeDeCollecteSuccess;
