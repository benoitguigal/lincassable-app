import {
  Collecte,
  Identity,
  PointDeCollecte,
  StatutTourneeEnum,
  Tournee,
  Transporteur,
  TypeDeVehiculeEnum,
  ZoneDeCollecte,
} from "../../types";
import {
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  useTable,
  useSelect,
} from "@refinedev/antd";
import { BaseOption, LogicalFilter } from "@refinedev/core";
import { Select, Space, Table, DatePicker, Flex } from "antd";
import CollecteEditButton from "../collecte/CollecteEditButton";
import CollecteCreateButton from "../collecte/CollecteCreateButton";
import dayjs from "dayjs";
import TourneeStatutTag from "./TourneeStatutTag";
import BonDeTourneeUpload from "./BonDeTourneeUpload";
import {
  statutTourneeOptions,
  typeDeVehiculeOptions,
} from "../../utility/options";
import { useMemo } from "react";

const { RangePicker } = DatePicker;

type TourneeListTableProps = {
  user: Identity;
};

type Record = Tournee & {
  collecte: (Collecte & { point_de_collecte: PointDeCollecte })[];
  transporteur: Transporteur;
  zone_de_collecte: ZoneDeCollecte;
};

const minDate = "2020-01-01";
const maxDate = "2099-01-01";

const TourneeListTable: React.FC<TourneeListTableProps> = ({ user }) => {
  const isTransporteur = user.appRole === "transporteur";

  const { tableProps, filters, setFilters } = useTable<Record>({
    syncWithLocation: true,
    pagination: { mode: "server" },
    sorters: { permanent: [{ field: "date", order: "desc" }] },
    filters: {
      mode: "server",
      initial: [
        {
          field: "date",
          value: [minDate, maxDate],
          operator: "between",
        },
      ],
      ...(isTransporteur
        ? {
            permanent: [
              {
                field: "transporteur_id",
                operator: "eq",
                value: user.transporteurId,
              },
              {
                field: "statut",
                operator: "ne",
                value: "En cours de préparation",
              },
            ],
          }
        : {}),
    },
    meta: {
      select:
        "*, collecte(*,point_de_collecte!collecte_point_de_collecte_id_fkey(nom)),transporteur(nom),zone_de_collecte(nom)",
    },
  });

  const { selectProps: transporteurSelectProps, query: transportersQuery } =
    useSelect<Transporteur>({
      resource: "transporteur",
      optionLabel: "nom",
      optionValue: "id",
      ...(user.transporteurId
        ? {
            filters: [
              { field: "id", operator: "eq", value: user.transporteurId },
            ],
          }
        : {}),
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

  const transporteurFilter = useMemo<BaseOption | null>(() => {
    const filter = filters.find(
      (f) => (f as LogicalFilter).field === "transporteur_id"
    );
    if (filter) {
      return {
        value: filter.value,
        label: transporteurById[filter.value]?.nom ?? "",
      };
    }
    return null;
  }, [filters, transporteurById]);

  const statutFilter = useMemo(() => {
    const filter = filters.find((f) => (f as LogicalFilter).field === "statut");
    if (filter) {
      return {
        value: filter.value,
        label: filter.value,
      };
    }
    return null;
  }, [filters]);

  return (
    <>
      <Flex gap="middle" style={{ marginBottom: "20px" }}>
        <RangePicker
          style={{ width: "250px" }}
          allowEmpty={true}
          allowClear={true}
          value={dateFilter}
          presets={[
            { label: "Passées", value: [null, dayjs()] },
            { label: "À venir", value: [dayjs(), null] },
          ]}
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
        {!isTransporteur && (
          <Select
            {...transporteurSelectProps}
            style={{ width: "250px" }}
            allowClear
            placeholder="Transporteur"
            value={transporteurFilter}
            onChange={(value) => {
              if (value) {
                setFilters(
                  [{ field: "transporteur_id", operator: "eq", value }],
                  "merge"
                );
              } else {
                setFilters(
                  filters.filter(
                    (f) => (f as LogicalFilter).field !== "transporteur_id"
                  ),
                  "replace"
                );
              }
            }}
          />
        )}
        {!isTransporteur && (
          <Select
            options={statutTourneeOptions}
            style={{ width: "300px" }}
            placeholder="Statut"
            allowClear
            value={statutFilter}
            onChange={(value) => {
              if (value) {
                setFilters(
                  [{ field: "statut", operator: "eq", value }],
                  "merge"
                );
              } else {
                setFilters(
                  filters.filter(
                    (f) => (f as LogicalFilter).field !== "statut"
                  ),
                  "replace"
                );
              }
            }}
          />
        )}
      </Flex>
      <Table {...tableProps} size="small" rowKey="id">
        <Table.Column
          dataIndex={["date"]}
          title="Date"
          render={(value: any) => (
            <DateField value={value} format="ddd DD MMM YY" locales="fr" />
          )}
        />
        <Table.Column
          dataIndex="zone_de_collecte"
          title="Zone de collecte"
          render={(zoneDeCollecte: ZoneDeCollecte) => {
            return zoneDeCollecte.nom ?? "";
          }}
        />
        <Table.Column
          dataIndex="statut"
          title="Statut"
          render={(value: StatutTourneeEnum) => (
            <TourneeStatutTag value={value} />
          )}
        />
        <Table.Column<Record>
          dataIndex="transporteur"
          title="Transporteur"
          render={(transporteur: Transporteur) => {
            return transporteur.nom;
          }}
        />
        <Table.Column<Record>
          dataIndex="collecte"
          title="Collectes"
          width={400}
          render={(collectes: Record["collecte"], record) => {
            const collectesBtn = collectes.map((collecte) => (
              <CollecteEditButton collecte={collecte} />
            ));
            const addCollecte = (
              <CollecteCreateButton tournee_id={record.id as number} />
            );
            return <Space wrap>{[...collectesBtn, addCollecte]}</Space>;
          }}
        />

        <Table.Column<Record>
          dataIndex="bon_de_tournee"
          title="Bon de tournée complété"
          render={(_, record) => {
            return (
              <div style={{ maxWidth: "150px" }}>
                <BonDeTourneeUpload
                  tournee={record}
                  zoneDeCollecte={record.zone_de_collecte}
                />
              </div>
            );
          }}
        ></Table.Column>
        <Table.Column
          dataIndex="type_de_vehicule"
          title="Type de véhicule"
          render={(type: TypeDeVehiculeEnum) => {
            return (
              typeDeVehiculeOptions.find((option) => option.value === type)
                ?.label ?? ""
            );
          }}
        />
        <Table.Column
          dataIndex="prix"
          title="Prix"
          render={(prix: number) => {
            return prix ? `${prix} €` : "";
          }}
        />
        <Table.Column<Record>
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default TourneeListTable;
