import {
  Collecte,
  CollecteWithPointDeCollecte,
  Identity,
  PointDeCollecte,
  StatutTourneeEnum,
  Tournee,
  Transporteur,
  ZoneDeCollecte,
} from "../../../types";
import {
  useTable,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  useEditableTable,
} from "@refinedev/antd";
import { CSSProperties, useMemo, useState } from "react";
import { BaseRecord, CanAccess, useList } from "@refinedev/core";
import { Flex, Space, Table, Tag, theme } from "antd";
import { CollecteEditButton } from "../../collecte/editButton";
import { CollecteCreateButton } from "../../collecte/createButton";
import { Chargement } from "../chargement";
import dayjs from "dayjs";
import TourneeMailButton from "../mail-button";
import { StatutTourneeTag } from "../statut-tournee";

type TourneeListTableProps = {
  user: Identity;
};

type TagEnum = "Tous" | "Past" | "Future";

export type TourneeWithCollectes = Tournee & {
  collectes: CollecteWithPointDeCollecte[];
};

const TourneeListTable: React.FC<TourneeListTableProps> = ({ user }) => {
  const { token } = theme.useToken();

  const isTransporteur = user.appRole === "transporteur";

  const [currentTag, setCurrentTag] = useState<TagEnum>("Tous");

  const { tableProps, tableQueryResult, filters, setFilters } =
    useEditableTable<Tournee>({
      syncWithLocation: true,
      sorters: { permanent: [{ field: "date", order: "desc" }] },
      filters: {
        mode: "server",
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

  const dateFilter = useMemo(() => {
    return filters.find((filter) => {
      if ("field" in filter) {
        return filter.field === "date";
      }
      return false;
    });
  }, [filters]);

  const tourneeList = useMemo(
    () => tableQueryResult?.data?.data ?? [],
    [tableQueryResult]
  );

  const { data: collectesData, isLoading: collecteIsLoading } =
    useList<Collecte>({
      resource: "collecte",
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

  const { data: transporteursData, isLoading: transporteurIsLoading } =
    useList<Transporteur>({
      resource: "transporteur",
      filters: [
        {
          field: "id",
          operator: "in",
          value: tourneeList.map((t) => t.transporteur_id),
        },
      ],
      queryOptions: {
        enabled: tourneeList && tourneeList.length > 0,
      },
    });

  const transporteursList = useMemo(
    () => transporteursData?.data ?? [],
    [transporteursData]
  );

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

  const { data: zoneDeCollecteData } = useList<ZoneDeCollecte>({
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

  const loading = useMemo(
    () =>
      tableProps.loading ||
      (tourneeList &&
        tourneeList.length > 0 &&
        (collecteIsLoading ||
          transporteurIsLoading ||
          pointDeCollecteIsLoading)),
    [
      tableProps.loading,
      tourneeList,
      collecteIsLoading,
      transporteurIsLoading,
      pointDeCollecteIsLoading,
    ]
  );

  const activeTageStyle: CSSProperties = {
    color: "#EAEDEC",
    backgroundColor: token.colorPrimary,
  };

  function handleTagClick(tag: TagEnum) {
    setCurrentTag(tag);
    if (tag === "Tous") {
      setFilters(
        filters.filter((f) => !("field" in f && f.field === "date")),
        "replace"
      );
    } else {
      const today = dayjs().format("YYYY-MM-DD");
      const operator = tag === "Future" ? "gte" : "lt";
      let newFilters = filters;
      if (dateFilter) {
        if (dateFilter.operator !== operator) {
          newFilters = filters.map((f) => {
            if ("field" in f && f.field === "date") {
              return { ...f, operator, value: today };
            }
            return f;
          });
        }
      } else {
        newFilters = [
          ...filters,
          {
            field: "date",
            operator: operator,
            value: today,
          },
        ];
      }
      setFilters(newFilters, "replace");
    }
  }

  return (
    <>
      <Flex style={{ marginBottom: "2em", marginTop: "1em" }}>
        <Tag
          style={{
            cursor: "pointer",
            ...(currentTag === "Tous" ? activeTageStyle : {}),
          }}
          onClick={() => handleTagClick("Tous")}
        >
          Tous
        </Tag>
        <Tag
          style={{
            cursor: "pointer",
            ...(currentTag === "Future" ? activeTageStyle : {}),
          }}
          onClick={() => handleTagClick("Future")}
        >
          À venir
        </Tag>
        <Tag
          style={{
            cursor: "pointer",
            ...(currentTag === "Past" ? activeTageStyle : {}),
          }}
          onClick={() => handleTagClick("Past")}
        >
          Passées
        </Tag>
      </Flex>

      <Table {...tableProps} loading={loading} rowKey="id">
        <Table.Column
          dataIndex={["date"]}
          title="Date"
          render={(value: any) => (
            <DateField value={value} format="ddd DD MMM YY" locales="fr" />
          )}
        />
        <Table.Column
          dataIndex="zone_de_collecte_id"
          title="Zone de collecte"
          render={(value: number) => zoneDeCollecteById[value]?.nom ?? ""}
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
            if (transporteurById && id) {
              return transporteurById[id]?.nom;
            }
            return null;
          }}
        />
        <Table.Column
          dataIndex="points_de_collecte"
          title="Collectes"
          width={400}
          render={(_, record: BaseRecord) => {
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
          dataIndex="chargement"
          title="Chargement retour (hors palettes)"
          render={(_, record: BaseRecord) => {
            if (record.id) {
              const collectes = tourneeById[record.id].collectes;
              return <Chargement collectes={collectes} />;
            }
            return null;
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
                  zoneDeCollecte={
                    zoneDeCollecteById[record.zone_de_collecte_id]
                  }
                />
              </CanAccess>
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default TourneeListTable;
