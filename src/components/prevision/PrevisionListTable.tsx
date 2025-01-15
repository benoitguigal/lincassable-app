import { useTable } from "@refinedev/antd";
import { PointDeCollecte, Prevision } from "../../types";
import { Table } from "antd";

type Record = Prevision & { point_de_collecte: Pick<PointDeCollecte, "nom"> };

const PrevisionListTable: React.FC = () => {
  const { tableProps, setFilters, filters } = useTable<Record>({
    resource: "prevision",
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      initial: [{ field: "date_estimation_prochaine_collecte", order: "asc" }],
    },
    meta: { select: "*, point_de_collecte(nom)" },
  });

  return (
    <Table {...tableProps} size="small" rowKey="id">
      <Table.Column<PointDeCollecte>
        dataIndex="point_de_collecte"
        title="Point de collecte"
        render={(value) => value.nom}
      />
    </Table>
  );
};

export default PrevisionListTable;
