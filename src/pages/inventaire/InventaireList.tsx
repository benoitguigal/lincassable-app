import {
  CreateButton,
  DeleteButton,
  EditButton,
  ExportButton,
  List,
  useTable,
} from "@refinedev/antd";
import { Inventaire, PointDeCollecte } from "../../types";
import { IResourceComponentsProps, useExport } from "@refinedev/core";
import { Space, Table } from "antd";
import { formatDateTime } from "../../utility/dateFormat";

const select = "*,point_de_collecte(id,nom)";

type Record = Inventaire & {
  point_de_collecte: Pick<PointDeCollecte, "id" | "nom">;
};

const InventaireList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable<Record>({
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      initial: [{ field: "date", order: "desc" }],
    },
    meta: { select },
  });

  const { isLoading, triggerExport } = useExport<Record>({
    mapData: (record: Record) => ({
      ...record,
      point_de_collecte: record.point_de_collecte.nom,
    }),
    meta: {
      select,
    },
  });

  return (
    <List
      canCreate={true}
      breadcrumb={false}
      headerButtons={(props) => [
        <ExportButton
          style={{ marginRight: "10px" }}
          onClick={triggerExport}
          loading={isLoading}
        >
          Exporter
        </ExportButton>,
        <CreateButton {...props.createButtonProps}>
          Ajouter un inventaire de stock
        </CreateButton>,
      ]}
    >
      <Table {...tableProps} size="small" rowKey="id">
        <Table.Column
          dataIndex="date"
          title="Date"
          render={(d) => formatDateTime(d)}
        />
        <Table.Column
          dataIndex="point_de_collecte"
          title="Point de collecte / massification"
          render={(pc: PointDeCollecte) => pc.nom}
        />
        <Table.Column dataIndex="stock_casiers_75" title="Stock casiers 75" />
        <Table.Column
          dataIndex="stock_casiers_75_plein"
          title="Stock casiers 75 plein"
        />
        <Table.Column dataIndex="stock_casiers_33" title="Stock casiers 33" />
        <Table.Column
          dataIndex="stock_casiers_33_plein"
          title="Stock casiers 33 plein"
        />
        <Table.Column dataIndex="stock_paloxs" title="Stock paloxs" />
        <Table.Column
          dataIndex="stock_paloxs_plein"
          title="Stock paloxs pleins"
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: Record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default InventaireList;
