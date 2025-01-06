import { List, useSelect, useTable } from "@refinedev/antd";
import { IResourceComponentsProps, useLink, useList } from "@refinedev/core";
import {
  Collecte,
  PointDeCollecte,
  Tournee,
  Transporteur,
  ZoneDeCollecte,
} from "../../types";
import { Select, Table } from "antd";
import { useMemo } from "react";

const CollecteList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, tableQuery, setFilters } = useTable<Collecte>({
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      initial: [{ field: "date", order: "desc" }],
    },
  });

  const Link = useLink();

  const collectes = useMemo(() => tableQuery.data?.data ?? [], [tableQuery]);

  const { data: pointDeCollecteData } = useList<PointDeCollecte>({
    resource: "point_de_collecte",
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: collectes.map((c) => c.point_de_collecte_id).filter(Boolean),
      },
    ],
    queryOptions: { enabled: collectes.length > 0 },
  });

  const pointDeCollecteById = useMemo(
    () =>
      (pointDeCollecteData?.data ?? []).reduce<{
        [key: number]: PointDeCollecte;
      }>((acc, pc) => {
        return { ...acc, [pc.id]: pc };
      }, {}),
    [pointDeCollecteData]
  );

  const { data: tourneeData } = useList<Tournee>({
    resource: "tournee",
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: collectes.map((c) => c.tournee_id).filter(Boolean),
      },
    ],
    queryOptions: { enabled: collectes.length > 0 },
  });

  const tourneeById = useMemo(
    () =>
      (tourneeData?.data ?? []).reduce<{
        [key: number]: Tournee;
      }>((acc, tournee) => {
        return { ...acc, [tournee.id]: tournee };
      }, {}),
    [tourneeData]
  );

  const { data: transporteurData } = useList<Transporteur>({
    resource: "transporteur",
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: tourneeData?.data.map((t) => t.transporteur_id).filter(Boolean),
      },
    ],
    queryOptions: { enabled: !!tourneeData && tourneeData.data.length > 0 },
  });

  const transporteurById = useMemo(
    () =>
      (transporteurData?.data ?? []).reduce<{
        [key: number]: Transporteur;
      }>((acc, transporteur) => {
        return { ...acc, [transporteur.id]: transporteur };
      }, {}),
    [transporteurData]
  );

  const { data: zoneDeCollecteData } = useList<ZoneDeCollecte>({
    resource: "zone_de_collecte",
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: tourneeData?.data
          .map((t) => t.zone_de_collecte_id)
          .filter(Boolean),
      },
    ],
    queryOptions: { enabled: !!tourneeData && tourneeData.data.length > 0 },
  });

  const zoneDeCollecteById = useMemo(
    () =>
      (zoneDeCollecteData?.data ?? []).reduce<{
        [key: number]: ZoneDeCollecte;
      }>((acc, zoneDeCollecte) => {
        return { ...acc, [zoneDeCollecte.id]: zoneDeCollecte };
      }, {}),
    [zoneDeCollecteData]
  );

  const { selectProps: pointDeCollecteSelectProps } =
    useSelect<PointDeCollecte>({
      resource: "point_de_collecte",
      optionLabel: "nom",
      optionValue: "id",
    });

  return (
    <List title="Collectes" canCreate={true} breadcrumb={false}>
      <Select
        {...pointDeCollecteSelectProps}
        style={{ width: "300px", marginBottom: "20px" }}
        allowClear
        placeholder="Point de collecte"
        onChange={(value) => {
          if (value) {
            setFilters(
              [{ field: "point_de_collecte_id", operator: "eq", value }],
              "replace"
            );
          } else {
            setFilters([], "replace");
          }
        }}
      />
      <Table {...tableProps} size="small" rowKey="id">
        <Table.Column
          dataIndex="point_de_collecte_id"
          title="Point de collecte"
          render={(id) => pointDeCollecteById[id]?.nom ?? ""}
        />
        <Table.Column dataIndex="date" title="Date" />
        <Table.Column
          dataIndex="collecte_nb_bouteilles"
          title="Nombre de bouteilles collectées"
        />
        <Table.Column
          dataIndex="collecte_nb_casier_75_plein"
          title="Nombre de casiers collectés"
        />
        <Table.Column
          dataIndex="collecte_nb_palox_plein"
          title="Nombre de paloxs collectés"
        />
        <Table.Column
          dataIndex="tournee_id"
          title="Tournée"
          render={(id) => {
            const tournee = tourneeById[id];
            if (tournee) {
              const zoneDeCollecte =
                zoneDeCollecteById[tournee.zone_de_collecte_id];
              if (zoneDeCollecte) {
                return (
                  <Link to={`/tournee/show/${id}`}>
                    {id} - {zoneDeCollecte.nom}
                  </Link>
                );
              }
            }
            return "";
          }}
        />
        <Table.Column
          dataIndex="tournee_id"
          title="Transporteur"
          render={(id) => {
            const tournee = tourneeById[id];
            if (tournee) {
              const transporteur = transporteurById[tournee.transporteur_id];
              if (transporteur) {
                return transporteur.nom;
              }
            }
            return "";
          }}
        />
      </Table>
    </List>
  );
};

export default CollecteList;
