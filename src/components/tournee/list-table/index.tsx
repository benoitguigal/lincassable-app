import {
  Collecte,
  CollecteWithPointDeCollecte,
  Identity,
  PointDeCollecte,
  StatutTourneeEnum,
  Tournee,
  Transporteur,
  TypeDeVehiculeEnum,
  ZoneDeCollecte,
} from "../../../types";
import {
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  useTable,
  FilterDropdown,
  useSelect,
} from "@refinedev/antd";
import { useMemo } from "react";
import { BaseRecord, CanAccess, useList } from "@refinedev/core";
import { Select, Space, Table, DatePicker, Spin } from "antd";
import { CollecteEditButton } from "../../collecte/editButton";
import { CollecteCreateButton } from "../../collecte/createButton";
import dayjs from "dayjs";
import TourneeMailButton from "../mail-button";
import { StatutTourneeTag } from "../statut-tournee";
import BonDeTourneeUpload from "../bon-de-tournee-upload";
import { typeDeVehiculeOptions } from "../../../utility/options";

const { RangePicker } = DatePicker;

type TourneeListTableProps = {
  user: Identity;
};

export type TourneeWithCollectes = Tournee & {
  collectes: CollecteWithPointDeCollecte[];
};

const minDate = "2020-01-01";
const maxDate = "2099-01-01";

const TourneeListTable: React.FC<TourneeListTableProps> = ({ user }) => {
  const isTransporteur = user.appRole === "transporteur";

  const { tableProps, tableQueryResult } = useTable<Tournee>({
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
            ],
          }
        : {}),
    },
  });

  const tourneeList = useMemo(
    () => tableQueryResult?.data?.data ?? [],
    [tableQueryResult]
  );

  const { data: collectesData, isLoading: collecteIsLoading } =
    useList<Collecte>({
      resource: "collecte",
      pagination: { mode: "off" },
      filters: [
        {
          field: "tournee_id",
          operator: "in",
          value: tourneeList.map((t) => t.id),
        },
      ],
      queryOptions: {
        enabled: tourneeList && tourneeList.length > 0,
      },
    });

  const collecteList = useMemo(
    () => collectesData?.data ?? [],
    [collectesData]
  );

  const { selectProps: transporteurSelectProps, query: transporteurQuery } =
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

  const transporteursList = useMemo(
    () => transporteurQuery?.data?.data ?? [],
    [transporteurQuery]
  );

  const transporteurIsLoading = transporteurQuery?.isLoading;

  const transporteurById = useMemo(
    () =>
      transporteursList.reduce<{
        [key: number]: Transporteur;
      }>((acc, t) => {
        return { ...acc, [t.id]: t };
      }, {}),
    [transporteursList]
  );

  const { data: pointsDeCollecteData, isLoading: pointDeCollecteIsLoading } =
    useList<PointDeCollecte>({
      resource: "point_de_collecte",
      pagination: { mode: "off" },
      filters: [
        {
          field: "id",
          operator: "in",
          value: collecteList.map((c) => c.point_de_collecte_id),
        },
      ],
      queryOptions: {
        enabled: collecteList && collecteList.length > 0,
      },
    });

  const pointsDeCollecteList = useMemo(
    () => pointsDeCollecteData?.data ?? [],
    [pointsDeCollecteData]
  );

  const pointDeCollecteById = useMemo(
    () =>
      pointsDeCollecteList.reduce<{
        [key: number]: PointDeCollecte;
      }>((acc, pc) => {
        return { ...acc, [pc.id]: pc };
      }, {}),
    [pointsDeCollecteList]
  );

  const { data: zoneDeCollecteData, isLoading: zoneDeCollecteIsLoading } =
    useList<ZoneDeCollecte>({
      resource: "zone_de_collecte",
      filters: [
        {
          field: "id",
          operator: "in",
          value: tourneeList
            .map((tournee) => tournee.zone_de_collecte_id)
            .filter(Boolean),
        },
      ],
      queryOptions: { enabled: tourneeList.length > 0 },
    });

  const zoneDeCollecteById = useMemo(
    () =>
      (zoneDeCollecteData?.data ?? []).reduce<{
        [key: number]: ZoneDeCollecte;
      }>((acc, zone) => {
        return { ...acc, [zone.id]: zone };
      }, {}),
    [zoneDeCollecteData]
  );

  const collecteListWithPointDeCollecte: CollecteWithPointDeCollecte[] =
    useMemo(
      () =>
        collecteList.map((c) => ({
          ...c,
          point_de_collecte: pointDeCollecteById[c.point_de_collecte_id],
        })),
      [collecteList, pointDeCollecteById]
    );

  const tourneeWithCollectes: TourneeWithCollectes[] = useMemo(
    () =>
      tourneeList.map((t) => ({
        ...t,
        collectes: collecteListWithPointDeCollecte.filter(
          (c) => c.tournee_id === t.id
        ),
      })),
    [tourneeList, collecteListWithPointDeCollecte]
  );

  const tourneeById = useMemo(
    () =>
      tourneeWithCollectes.reduce<{
        [key: string]: TourneeWithCollectes;
      }>((acc, t) => ({ ...acc, [t.id]: t }), {}),
    [tourneeWithCollectes]
  );

  return (
    <Table {...tableProps} size="small" rowKey="id">
      <Table.Column
        dataIndex={["date"]}
        title="Date"
        render={(value: any) => (
          <DateField value={value} format="ddd DD MMM YY" locales="fr" />
        )}
        // defaultFilteredValue={getDefaultFilter("date", filters, "between")}
        filterDropdown={(props) => (
          <FilterDropdown
            {...props}
            mapValue={(selectedKeys, event) => {
              if (!selectedKeys) {
                return selectedKeys;
              }

              if (event === "value") {
                return selectedKeys.map((key) => {
                  if (typeof key === "string") {
                    if (key === minDate || key === maxDate) {
                      return null;
                    }
                    return dayjs(key);
                  }

                  return key;
                });
              }

              if (event === "onChange") {
                return selectedKeys.map((key, idx) => {
                  if (!key) {
                    return idx === 0 ? minDate : maxDate;
                  }
                  return dayjs.isDayjs(key) ? key.format("YYYY-MM-DD") : key;
                });
              }

              return selectedKeys;
            }}
          >
            <RangePicker
              allowEmpty={true}
              allowClear={true}
              presets={[
                { label: "Passées", value: [null, dayjs()] },
                { label: "À venir", value: [dayjs(), null] },
              ]}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="zone_de_collecte_id"
        title="Zone de collecte"
        render={(value: number) => {
          if (zoneDeCollecteIsLoading) {
            return <Spin size="small" spinning={true} />;
          }
          return zoneDeCollecteById[value]?.nom ?? "";
        }}
      />
      <Table.Column
        dataIndex="statut"
        title="Statut"
        render={(value: StatutTourneeEnum) => (
          <StatutTourneeTag value={value} />
        )}
      />
      <Table.Column
        dataIndex="transporteur_id"
        title="Transporteur"
        render={(id: number) => {
          if (transporteurIsLoading) {
            return <Spin size="small" spinning={true} />;
          }
          if (transporteurById && id) {
            return transporteurById[id]?.nom;
          }
          return null;
        }}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              {...transporteurSelectProps}
              style={{ width: "200px" }}
              allowClear
              placeholder="Transporteur"
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="points_de_collecte"
        title="Collectes"
        width={400}
        render={(_, record: BaseRecord) => {
          if (collecteIsLoading || pointDeCollecteIsLoading) {
            return <Spin size="small" spinning={true} />;
          }
          if (record.id) {
            const collectes = tourneeById[record.id].collectes.map(
              (collecte) => <CollecteEditButton collecte={collecte} />
            );
            const addCollecte = (
              <CollecteCreateButton tournee_id={record.id as number} />
            );
            return <Space wrap>{[...collectes, addCollecte]}</Space>;
          }
          return null;
        }}
      />

      <Table.Column
        dataIndex="bon_de_tournee"
        title="Bon de tournée complété"
        render={(_, record: Tournee) => {
          return (
            <div style={{ maxWidth: "150px" }}>
              <BonDeTourneeUpload
                tournee={record}
                zoneDeCollecte={zoneDeCollecteById[record.zone_de_collecte_id]}
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
      <Table.Column<Tournee>
        title="Actions"
        dataIndex="actions"
        render={(_, record) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <ShowButton hideText size="small" recordItemId={record.id} />
            <DeleteButton hideText size="small" recordItemId={record.id} />
            <CanAccess resource="tournee" action="send_mail">
              <TourneeMailButton
                tournee={record}
                zoneDeCollecte={zoneDeCollecteById[record.zone_de_collecte_id]}
              />
            </CanAccess>
          </Space>
        )}
      />
    </Table>
  );
};

export default TourneeListTable;
