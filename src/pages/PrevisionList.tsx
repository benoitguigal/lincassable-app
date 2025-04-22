import { EnvironmentOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { ExportButton, List } from "@refinedev/antd";
import { IResourceComponentsProps, useExport } from "@refinedev/core";
import { Segmented } from "antd";
import { useState } from "react";
import PrevisionListTable from "../components/prevision/PrevisionListTable";
import PrevisionMap from "../components/prevision/PrevisionMap";
import { PointDeCollecte, Prevision } from "../types";

type View = "table" | "map";
const viewName = "previsions-view";

const PrevisionList: React.FC<IResourceComponentsProps> = () => {
  const { isLoading, triggerExport } = useExport<
    Prevision & { point_de_collecte: Pick<PointDeCollecte, "nom"> }
  >({
    mapData: ({ point_de_collecte, ...rest }) => ({
      point_de_collecte: point_de_collecte.nom,
      ...rest,
    }),
    meta: { select: "*, point_de_collecte(nom)" },
  });

  const [view, setView] = useState<View>(
    (sessionStorage.getItem(viewName) as View) || "table"
  );

  const handleViewChange = (value: View) => {
    setView(value);
    sessionStorage.setItem(viewName, value);
  };

  return (
    <List
      title="Prévisions"
      canCreate={false}
      breadcrumb={false}
      headerButtons={() => [
        <Segmented<View>
          key="view"
          size="large"
          value={view}
          style={{ marginRight: 24 }}
          options={[
            {
              label: "",
              value: "table",
              icon: <UnorderedListOutlined />,
            },
            {
              label: "",
              value: "map",
              icon: <EnvironmentOutlined />,
            },
          ]}
          onChange={handleViewChange}
        />,
        <ExportButton
          style={{ marginRight: "10px" }}
          onClick={triggerExport}
          loading={isLoading}
        >
          Exporter
        </ExportButton>,
      ]}
    >
      {view === "table" && <PrevisionListTable />}
      {view === "map" && <PrevisionMap />}
    </List>
  );
};

export default PrevisionList;
