import React, { useMemo, useState } from "react";
import { IResourceComponentsProps, useExport } from "@refinedev/core";
import { List, ExportButton, CreateButton } from "@refinedev/antd";
import PointDeCollecteListTable from "../../components/pointsDeCollecte/PointDeCollecteListTable";
import { Segmented } from "antd";
import { EnvironmentOutlined, UnorderedListOutlined } from "@ant-design/icons";
import PointsDeCollecteMap from "../../components/pointsDeCollecte/PointsDeCollecteMap";
import PointDeCollecteColumnSelect from "../../components/pointsDeCollecte/PointDeCollecteColumnSelect";

type View = "table" | "map";
const viewName = "point-de-collecte-view";
const columnsName = "point-de-collecte-columns";

const tableColumnOptions = [
  {
    value: "nom",
    label: "Nom",
    default: true,
  },
  { value: "type", label: "Type", default: true },
  { value: "setup_date", label: "Date de setup" },
  {
    value: "adresse",
    label: "Adresse",
    default: true,
  },
  { value: "zone_de_collecte_id", label: "Zone de collecte" },
  {
    value: "contenant_collecte_types",
    label: "Type de contentants",
    default: true,
  },
  { value: "stock_casiers_75", label: "Stock casiers 75cl" },
  { value: "stock_casiers_33", label: "Stock casiers 33cl" },
  { value: "stock_paloxs", label: "Stock paloxs" },
  { value: "horaires", label: "Horaires" },
  { value: "contacts", label: "Contact" },
  { value: "emails", label: "Email", default: true },
  { value: "telephones", label: "Téléphone", default: true },
  { value: "info", label: "Informations compl." },
];

const PointDeCollecteList: React.FC<IResourceComponentsProps> = () => {
  const { isLoading, triggerExport } = useExport();

  const [view, setView] = useState<View>(
    (sessionStorage.getItem(viewName) as View) || "table"
  );

  const handleViewChange = (value: View) => {
    setView(value);
    sessionStorage.setItem(viewName, value);
  };

  const tableColumnsDefault = useMemo(
    () =>
      tableColumnOptions
        .filter((option) => option.default)
        .map((option) => option.value),
    []
  );

  const [tableColumns, setTableColumns] = useState<string[]>(() => {
    const storedColumns = sessionStorage.getItem(columnsName);
    if (!storedColumns) {
      return tableColumnsDefault;
    }
    return storedColumns.split(",");
  });

  const handleColumnsChange = (value: string[]) => {
    setTableColumns(value);
    sessionStorage.setItem(columnsName, value.join(","));
  };

  return (
    <List
      title="Points de collecte"
      canCreate={true}
      breadcrumb={false}
      headerButtons={(props) => [
        <PointDeCollecteColumnSelect
          hidden={view !== "table"}
          value={tableColumns}
          options={tableColumnOptions}
          onChange={handleColumnsChange}
        />,
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
      {view === "table" && <PointDeCollecteListTable columns={tableColumns} />}
      {view === "map" && <PointsDeCollecteMap />}
    </List>
  );
};

export default PointDeCollecteList;
