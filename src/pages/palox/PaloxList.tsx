import {
  CreateButton,
  DeleteButton,
  EditButton,
  ExportButton,
  List,
  useTable,
} from "@refinedev/antd";
import { IResourceComponentsProps, useExport } from "@refinedev/core";
import { Palox, PointDeCollecte } from "../../types";
import { Space, Table } from "antd";
import StatutPalox from "../../components/palox/StatutPalox";

type Record = Palox & {
  point_de_collecte: Pick<PointDeCollecte, "id" | "nom">;
};

const select = "*,point_de_collecte(id,nom)";

const PaloxList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable<Record>({
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      initial: [{ field: "numero", order: "asc" }],
    },
    meta: { select },
  });

  const { isLoading, triggerExport } = useExport<Record>({
    mapData: (record: Record) => ({
      ...record,
      point_de_collecte: record.point_de_collecte?.nom ?? "",
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
          Ajouter un palox
        </CreateButton>,
      ]}
    >
      <Table {...tableProps} size="small" rowKey="id">
        <Table.Column dataIndex="numero" title="Numéro" />
        <Table.Column
          dataIndex="statut"
          title="Statut"
          render={(statut) => <StatutPalox value={statut} />}
        />
        <Table.Column
          dataIndex="point_de_collecte"
          title="Localisation"
          render={(pc: PointDeCollecte) => pc?.nom ?? ""}
        />
        <Table.Column dataIndex="model" title="Modèle" />
        <Table.Column dataIndex="format_tri" title="Format tri" />
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

export default PaloxList;
