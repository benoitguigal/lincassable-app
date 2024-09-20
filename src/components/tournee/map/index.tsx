import { useList } from "@refinedev/core";
import { Collecte, Tournee } from "../../../types";
import { Spin } from "antd";
import { useMemo } from "react";
import { PointsDeCollecteMap } from "../../pointsDeCollecte/map";

type TourneeMapProps = Pick<Tournee, "id" | "point_de_massification_id">;

const TourneeMap: React.FC<TourneeMapProps> = ({
  id,
  point_de_massification_id,
}) => {
  const { data: collecteseData, isLoading: collectesIsLoading } =
    useList<Collecte>({
      resource: "collecte",
      pagination: { mode: "off" },
      filters: [
        {
          field: "tournee_id",
          operator: "eq",
          value: id,
        },
      ],
    });

  const pointsDeCollectesIds = useMemo(
    () => [
      point_de_massification_id,
      ...(collecteseData?.data?.map((c) => c.point_de_collecte_id) ?? []),
    ],
    [collecteseData, point_de_massification_id]
  );

  const { data: pointsDeCollecteData, isLoading: pointsDeCollecteIsLoading } =
    useList<Collecte>({
      resource: "point_de_collecte",
      pagination: { mode: "off" },
      filters: [
        {
          field: "id",
          operator: "in",
          value: pointsDeCollectesIds,
        },
      ],
      queryOptions: { enabled: !!collecteseData?.data },
    });

  const pointsDeCollecteList = useMemo(
    () => pointsDeCollecteData?.data ?? [],
    [pointsDeCollecteData]
  );

  const loading = collectesIsLoading || pointsDeCollecteIsLoading;

  if (loading) {
    return <Spin />;
  }

  return (
    <PointsDeCollecteMap
      pointDeCollecteIds={pointsDeCollecteList.map((p) => p.id)}
    />
  );
};

export default TourneeMap;
