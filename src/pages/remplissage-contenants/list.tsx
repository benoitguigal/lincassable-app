import { List, useTable } from "@refinedev/antd";
import { IResourceComponentsProps, useList } from "@refinedev/core";
import { PointDeCollecte, RemplissageContenants } from "../../types";
import { Table } from "antd";
import { useMemo } from "react";

export const RemplissageContenantsList: React.FC<
  IResourceComponentsProps
> = () => {
  const { tableProps, tableQueryResult } = useTable<RemplissageContenants>({
    syncWithLocation: true,
    pagination: { mode: "server", pageSize: 15 },
    sorters: {
      mode: "server",
      initial: [{ field: "date", order: "desc" }],
    },
  });

  const remplissageContenantsList = useMemo(
    () => tableQueryResult?.data?.data ?? [],
    [tableQueryResult]
  );

  const { data: pointDeCollecteData } = useList<PointDeCollecte>({
    resource: "point_de_collecte",
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: [
          ...new Set(
            remplissageContenantsList.map((r) => r.point_de_collecte_id)
          ),
        ],
      },
    ],
    queryOptions: { enabled: remplissageContenantsList?.length > 0 },
  });

  const pointDeCollecteById = useMemo(
    () =>
      (pointDeCollecteData?.data ?? []).reduce<{
        [key: number]: PointDeCollecte;
      }>((acc, t) => {
        return { ...acc, [t.id]: t };
      }, {}),
    [pointDeCollecteData]
  );

  return (
    <List title="Taux de remplissage" canCreate={false} breadcrumb={false}>
      <Table {...tableProps} size="small" rowKey="id">
        <Table.Column dataIndex="date" title="Date" />
        <Table.Column
          dataIndex="point_de_collecte_id"
          title="Point de collecte"
          render={(value) => pointDeCollecteById[value]?.nom}
        />
        <Table.Column
          dataIndex="demande_collecte"
          title="Demande de collecte"
          render={(value) => (value === true ? <b>Oui</b> : "Non")}
        />
        <Table.Column
          dataIndex="nb_casiers_plein"
          title="Nombre de casiers pleins"
        />
        <Table.Column
          dataIndex="nb_casiers_total"
          title="Stocks de contenants (via formulaire)"
        />
        <Table.Column
          dataIndex="point_de_collecte_id"
          title="Stock de contenants (en base)"
          render={(value) => pointDeCollecteById[value]?.stock_contenants}
        />
        <Table.Column
          dataIndex="remplissage_palox"
          title="Remplissage palox"
          render={(value) => (value ? `${value}%` : "")}
        />
      </Table>
    </List>
  );
};
