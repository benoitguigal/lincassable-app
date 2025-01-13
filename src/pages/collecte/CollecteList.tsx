import {
  CreateButton,
  DeleteButton,
  EditButton,
  ExportButton,
  List,
  useSelect,
  useTable,
} from "@refinedev/antd";
import {
  BaseOption,
  BaseRecord,
  IResourceComponentsProps,
  LogicalFilter,
  useExport,
  useLink,
} from "@refinedev/core";
import {
  Collecte,
  PointDeCollecte,
  Tournee,
  Transporteur,
  ZoneDeCollecte,
} from "../../types";
import { Flex, Select, Space, Table, DatePicker } from "antd";
import { useMemo } from "react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const select =
  "*, tournee!inner(*,transporteur(nom),zone_de_collecte(nom)),point_de_collecte(id,nom)";

type Record = Collecte & {
  tournee?: Tournee & {
    transporteur: Pick<Transporteur, "nom">;
    zone_de_collecte: Pick<ZoneDeCollecte, "nom">;
  };
} & { point_de_collecte: Pick<PointDeCollecte, "id" | "nom"> };

const CollecteList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, setFilters, filters } = useTable<Record>({
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      initial: [{ field: "date", order: "desc" }],
    },
    // see https://refine.dev/docs/data/packages/supabase/#deep-filtering
    meta: {
      select,
    },
  });

  const Link = useLink();

  const {
    selectProps: pointDeCollecteSelectProps,
    query: pointDeCollecteQuery,
  } = useSelect<PointDeCollecte>({
    resource: "point_de_collecte",
    pagination: { mode: "off" },
    optionLabel: "nom",
    optionValue: "id",
  });

  const pointDeCollecteById = useMemo(
    () =>
      (pointDeCollecteQuery.data?.data ?? []).reduce<{
        [key: number]: PointDeCollecte;
      }>((acc, pc) => {
        return { ...acc, [pc.id]: pc };
      }, {}),
    [pointDeCollecteQuery]
  );

  const { selectProps: transporteurSelectProps, query: transportersQuery } =
    useSelect<Transporteur>({
      resource: "transporteur",
      pagination: { mode: "off" },
      optionLabel: "nom",
      optionValue: "id",
    });

  const transporteurById = useMemo(
    () =>
      (transportersQuery?.data?.data ?? []).reduce<{
        [key: number]: Transporteur;
      }>((acc, transporteur) => {
        return { ...acc, [transporteur.id]: transporteur };
      }, {}),
    [transportersQuery]
  );

  const pointDeCollecteFilter = useMemo<BaseOption | null>(() => {
    const filter = filters.find(
      (f) => (f as LogicalFilter).field === "point_de_collecte_id"
    );
    if (filter) {
      return {
        value: filter.value,
        label: pointDeCollecteById[filter.value]?.nom ?? "",
      };
    }
    return null;
  }, [filters, pointDeCollecteById]);

  const transporteurFilter = useMemo<BaseOption | null>(() => {
    const filter = filters.find(
      (f) => (f as LogicalFilter).field === "tournee.transporteur_id"
    );
    if (filter) {
      return {
        value: filter.value,
        label: transporteurById[filter.value]?.nom ?? "",
      };
    }
    return null;
  }, [filters, transporteurById]);

  const dateFilter = useMemo<[dayjs.Dayjs | null, dayjs.Dayjs | null]>(() => {
    const filterGte = filters.find(
      (f) => (f as LogicalFilter).field === "date" && f.operator === "gte"
    );
    const filterLte = filters.find(
      (f) => (f as LogicalFilter).field === "date" && f.operator === "lte"
    );

    return [
      filterGte ? dayjs(filterGte.value) : null,
      filterLte ? dayjs(filterLte.value) : null,
    ];
  }, [filters]);

  const { isLoading, triggerExport } = useExport<Record>({
    mapData: (collecte) => {
      return {
        "Point de collecte":
          pointDeCollecteById[collecte.point_de_collecte_id]?.nom ?? "",
        Date: collecte.date,
        "Nombre de bouteilles collectées": collecte.collecte_nb_bouteilles,
        "Nombre de casiers collectées": collecte.collecte_nb_casier_75_plein,
        "Nombre de casiers livrés": collecte.livraison_nb_casier_75_vide,
        "Nombre de paloxs collectés": collecte.collecte_nb_palox_plein,
        "Nombre de paloxs livrées": collecte.livraison_nb_palox_vide,
        Tournée: collecte.tournee_id,
        Transporteur: collecte.tournee ? collecte.tournee.transporteur.nom : "",
      };
    },
    meta: {
      select,
    },
  });

  return (
    <List
      title="Liste des collectes par point"
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
          Ajouter une collecte
        </CreateButton>,
      ]}
    >
      <Flex gap="middle" style={{ marginBottom: "20px" }}>
        <Select
          {...pointDeCollecteSelectProps}
          style={{ width: "250px" }}
          allowClear
          placeholder="Point de collecte"
          value={pointDeCollecteFilter}
          onChange={(value) => {
            if (value) {
              setFilters(
                [{ field: "point_de_collecte_id", operator: "eq", value }],
                "merge"
              );
            } else {
              setFilters(
                filters.filter(
                  (f) => (f as LogicalFilter).field !== "point_de_collecte_id"
                ),
                "replace"
              );
            }
          }}
        />
        <Select
          {...transporteurSelectProps}
          style={{ width: "250px" }}
          allowClear
          placeholder="Transporteur"
          value={transporteurFilter}
          onChange={(value) => {
            if (value) {
              // see https://refine.dev/docs/data/packages/supabase/#deep-filtering
              setFilters(
                [{ field: "tournee.transporteur_id", operator: "eq", value }],
                "merge"
              );
            } else {
              setFilters(
                filters.filter(
                  (f) =>
                    (f as LogicalFilter).field !== "tournee.transporteur_id"
                ),
                "replace"
              );
            }
          }}
        />
        <RangePicker
          style={{ width: "250px" }}
          allowEmpty={true}
          allowClear={true}
          value={dateFilter}
          onChange={(value) => {
            if (value) {
              const [gte, lte] = value;
              if (gte) {
                setFilters(
                  [
                    {
                      field: "date",
                      operator: "gte",
                      value: gte.format("YYYY-MM-DD"),
                    },
                  ],
                  "merge"
                );
              }

              if (lte) {
                setFilters(
                  [
                    {
                      field: "date",
                      operator: "lte",
                      value: lte.format("YYYY-MM-DD"),
                    },
                  ],
                  "merge"
                );
              }
            } else {
              setFilters(
                filters.filter((f) => (f as LogicalFilter).field !== "date"),
                "replace"
              );
            }
          }}
        />
      </Flex>

      <Table {...tableProps} size="small" rowKey="id">
        <Table.Column
          dataIndex="point_de_collecte"
          title="Point de collecte"
          render={(pointDeCollecte: Record["point_de_collecte"]) => {
            if (pointDeCollecte) {
              return (
                <Link to={`/point-de-collecte/show/${pointDeCollecte.id}`}>
                  {pointDeCollecte.nom}
                </Link>
              );
            }
            return "";
          }}
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
          dataIndex="livraison_nb_casier_75_vide"
          title="Nombre de casiers livrés"
        />
        <Table.Column
          dataIndex="collecte_nb_palox_plein"
          title="Nombre de paloxs collectés"
        />
        <Table.Column
          dataIndex="livraison_nb_palox_vide"
          title="Nombre de paloxs livrés"
        />
        <Table.Column<Record>
          dataIndex="tournee"
          title="Tournée"
          render={(tournee: Record["tournee"]) => {
            if (tournee && tournee.zone_de_collecte) {
              return (
                <Link to={`/tournee/show/${tournee.id}`}>
                  {tournee.id} - {tournee.zone_de_collecte.nom}
                </Link>
              );
            }
            return "";
          }}
        />
        <Table.Column<Record>
          dataIndex="tournee"
          title="Transporteur"
          render={(tournee: Record["tournee"]) => {
            if (tournee && tournee.transporteur) {
              return tournee.transporteur.nom;
            }
            return "";
          }}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              {/* <ShowButton hideText size="small" recordItemId={record.id} /> */}
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default CollecteList;
