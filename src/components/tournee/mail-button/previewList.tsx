import { useList } from "@refinedev/core";
import { useMemo } from "react";
import { PointDeCollecte } from "../../../types";
import { Carousel } from "antd";
import TourneeMailPreview from "./preview";
import "./carousel.css";

type TourneeMailPreviewListProps = {
  pointDeCollecteIds: number[];
  dateTournee: string;
  dateLimit: string;
};

const TourneeMailPreviewList: React.FC<TourneeMailPreviewListProps> = ({
  pointDeCollecteIds,
  dateTournee,
  dateLimit,
}) => {
  const { data: pointDeCollecteData } = useList<PointDeCollecte>({
    resource: "point_de_collecte",
    filters: [{ field: "id", operator: "in", value: pointDeCollecteIds }],
    queryOptions: { enabled: pointDeCollecteIds.length > 0 },
  });

  const pointsDeCollecte = useMemo(
    () => pointDeCollecteData?.data ?? [],
    [pointDeCollecteData]
  );

  return (
    <Carousel arrows={true}>
      {pointsDeCollecte.map((pc) => (
        <div>
          <TourneeMailPreview
            pointDeCollecte={pc}
            dateTournee={dateTournee}
            dateLimit={dateLimit}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default TourneeMailPreviewList;
