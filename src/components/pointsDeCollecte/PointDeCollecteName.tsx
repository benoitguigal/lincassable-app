import { Tag } from "antd";
import { PointDeCollecte } from "../../types";
import { useOne } from "@refinedev/core";
import { ArrowRightOutlined } from "@ant-design/icons";

type PointDeCollecteNameProps = {
  pointDeCollecte: PointDeCollecte;
};

const PointDeCollecteName: React.FC<PointDeCollecteNameProps> = ({
  pointDeCollecte,
}) => {
  const { data: collectedBy } = useOne<PointDeCollecte>({
    resource: "point_de_collecte",
    id: pointDeCollecte.collecte_par_id ?? "",
    queryOptions: { enabled: !!pointDeCollecte.collecte_par_id },
  });

  return (
    <>
      <div>{pointDeCollecte.nom}</div>
      {pointDeCollecte.statut === "archive" && <Tag color="red">Archivé</Tag>}
      {!!collectedBy?.data && (
        <div>
          <Tag color="blue">
            <ArrowRightOutlined /> Collecté via {collectedBy.data.nom}
          </Tag>
        </div>
      )}
    </>
  );
};

export default PointDeCollecteName;
