import { IResourceComponentsProps } from "@refinedev/core";
import { PointDeCollecte } from "../types";
import { useTable } from "@refinedev/antd";
import { Table } from "antd";

const PointDeMassificationList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable<PointDeCollecte>({
    resource: "point_de_collecte",
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      initial: [{ field: "nom", order: "asc" }],
    },
    filters: {
      permanent: [
        { field: "type", operator: "eq", value: "Massification" },
        { field: "statut", operator: "ne", value: "archive" },
      ],
    },
  });

  return (
    <Table {...tableProps} size="small" rowKey="id">
      <Table.Column dataIndex="nom" title="Nom" />
      <Table.Column dataIndex="stock_casiers_75" title="Stock casiers 75" />
      <Table.Column
        dataIndex="stock_casiers_75_plein"
        title="Stocks casier 75 plein"
      />
    </Table>
  );
};

export default PointDeMassificationList;
