import React, { useState } from "react";
import { IResourceComponentsProps, useExport } from "@refinedev/core";
import { List, ExportButton, CreateButton } from "@refinedev/antd";
import { PointDeCollecteListTable } from "../../components/pointsDeCollecte/list-table";
import { Segmented } from "antd";
import { EnvironmentOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { PointsDeCollecteMap } from "../../components/pointsDeCollecte/map";

type View = "table" | "map";
const viewName = "point-de-collecte-view";

export const PointDeCollecteList: React.FC<IResourceComponentsProps> = () => {
  const { isLoading, triggerExport } = useExport();

  const [view, setView] = useState<View>(
    (localStorage.getItem(viewName) as View) || "table"
  );

  const handleViewChange = (value: View) => {
    setView(value);
    localStorage.setItem(viewName, value);
  };

  return (
    <List
      title="Points de collecte"
      canCreate={true}
      breadcrumb={false}
      headerButtons={(props) => [
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
        <CreateButton {...props.createButtonProps}>
          Ajouter un point de collecte
        </CreateButton>,
      ]}
    >
      {view === "table" && <PointDeCollecteListTable />}
      {view === "map" && <PointsDeCollecteMap />}
    </List>
  );
};
