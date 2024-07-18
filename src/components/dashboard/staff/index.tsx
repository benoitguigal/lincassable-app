import { useList } from "@refinedev/core";
import { useMemo } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { PointDeCollecte } from "../../../types";

export const StaffDashboard: React.FC = () => {
  const { data: pointsDeCollecteData, isLoading } = useList<PointDeCollecte>({
    resource: "point_de_collecte",
    pagination: {
      mode: "off",
    },
  });

  const pointsDeCollecte = useMemo(
    () => pointsDeCollecteData?.data || [],
    [pointsDeCollecteData]
  );

  const magasins = useMemo(
    () => pointsDeCollecte.filter((p) => p.type === "Magasin"),
    [pointsDeCollecte]
  );

  const producteurs = useMemo(
    () => pointsDeCollecte.filter((p) => p.type === "Producteur"),
    [pointsDeCollecte]
  );

  const massification = useMemo(
    () => pointsDeCollecte.filter((p) => p.type === "Massification"),
    [pointsDeCollecte]
  );

  return (
    <div>
      <div style={{ marginTop: "15px" }}>
        <h3>Collecte</h3>
        <Row gutter={16}>
          <Col span={4}>
            <Card>
              <Statistic
                title="Nombre total de points de collecte"
                value={pointsDeCollecte.length}
                loading={isLoading}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Nombre de magasins points de collecte"
                value={magasins.length}
                loading={isLoading}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Nombre de producteurs points de collecte"
                value={producteurs.length}
                loading={isLoading}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Nombre de points de massification secondaires"
                value={massification.length}
                loading={isLoading}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
