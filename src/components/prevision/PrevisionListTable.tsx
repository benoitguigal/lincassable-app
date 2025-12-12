import { useTable } from "@refinedev/antd";
import { PointDeCollecte, Prevision } from "../../types";
import { Table } from "antd";
import "./PrevisionListTable.css";

type Record = Prevision & {
  point_de_collecte: Pick<
    PointDeCollecte,
    "nom" | "contenant_collecte_type" | "stock_casiers_75" | "stock_paloxs"
  >;
};

function rowClassName(record: Record) {
  const nbJours = record.nb_jours_avant_estimation_prochaine_collecte;
  if (nbJours !== null) {
    if (nbJours < 0) {
      return "bg-red";
    } else if (nbJours < 30) {
      return "bg-orange";
    } else {
      return "bg-green";
    }
  }
  return "";
}

const PrevisionListTable: React.FC = () => {
  const { tableProps } = useTable<Record>({
    resource: "prevision",
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      initial: [{ field: "date_estimation_prochaine_collecte", order: "asc" }],
    },
    filters: {
      permanent: [
        {
          field: "point_de_collecte.collecte_par_id",
          operator: "null",
          value: true,
        },
        {
          field: "point_de_collecte.statut",
          operator: "eq",
          value: "actif",
        },
      ],
    },
    meta: {
      select:
        "*, point_de_collecte!inner(nom,contenant_collecte_types,stock_casiers_75,stock_paloxs,collecte_par_id,statut)",
    },
  });

  return (
    <Table {...tableProps} size="small" rowKey="id" rowClassName={rowClassName}>
      <Table.Column<Record>
        dataIndex="point_de_collecte"
        title="Point de collecte"
        render={(value) => value.nom}
      />
      <Table.Column<Record>
        dataIndex="date_estimation_prochaine_collecte"
        title="Date estiméee prochaine collecte"
      />
      <Table.Column<Record> dataIndex="capacite" title="Capacité" />
      <Table.Column<Record>
        dataIndex="point_de_collecte"
        title="Types de contenant"
        render={(value) => value.contenant_collecte_types.join(" ")}
      />
      <Table.Column<Record>
        dataIndex="point_de_collecte"
        title="Stock casiers 75cl"
        render={(value) => value.stock_casiers_75}
      />
      <Table.Column<Record>
        dataIndex="point_de_collecte"
        title="Stock casiers 33cl"
        render={(value) => value.stock_casiers_33}
      />
      <Table.Column<Record>
        dataIndex="point_de_collecte"
        title="Stock paloxs"
        render={(value) => value.stock_paloxs}
      />
      <Table.Column<Record>
        dataIndex="date_derniere_collecte"
        title="Date dernière collecte"
      />
      <Table.Column<Record>
        dataIndex="nb_bouteilles_derniere_collecte"
        title="# bouteilles collectées dernière collecte"
      />
      <Table.Column<Record>
        dataIndex="date_avant_derniere_collecte"
        title="Date avant dernière collecte"
      />
      <Table.Column<Record>
        dataIndex="nb_bouteilles_avant_derniere_collecte"
        title="# bouteilles collectées avant dernière collecte"
      />
      <Table.Column<Record>
        dataIndex="date_dernier_formulaire_remplissage"
        title="Date dernier formulaire rempli"
      />
      <Table.Column<Record>
        dataIndex="nb_bouteilles_dernier_formulaire_remplissage"
        title="# bouteilles dernier formulaire rempli"
      />
    </Table>
  );
};

export default PrevisionListTable;
