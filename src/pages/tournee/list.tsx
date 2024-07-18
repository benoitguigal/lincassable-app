import {
  BaseRecord,
  IResourceComponentsProps,
  useGetIdentity,
  useList,
} from "@refinedev/core";
import {
  List,
  useTable,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { Space, Table } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {
  Collecte,
  Identity,
  PointDeCollecte,
  Tournee,
  Transporteur,
  TransporteurUser,
} from "../../types";
import { useMemo } from "react";
import { Chargement } from "../../components/tournee/chargement";
import { CollecteEditButton } from "../../components/collecte/editButton";
import { CollecteCreateButton } from "../../components/collecte/createButton";

dayjs.locale("fr"); // use locale globally

export type CollecteWithPointDeCollecte = Collecte & {
  point_de_collecte?: PointDeCollecte | null;
};

export type TourneeWithCollectes = Tournee & {
  collectes: CollecteWithPointDeCollecte[];
};

export const TourneeList: React.FC<IResourceComponentsProps> = () => {
  const identityResponse = useGetIdentity<Identity>();

  const user = useMemo(() => identityResponse.data, [identityResponse]);

  const isTransporteur = user?.appRole === "transporteur";
  const isStaff = user?.appRole === "staff";

  const {
    data: transporteurUsersData,
    isLoading: transporteurUsersIsLoading,
    status: transporteurUsersStatus,
  } = useList<TransporteurUser>({
    resource: "transporteur_users",
    queryOptions: { enabled: isTransporteur },
  });

  const transporteurList = useMemo(
    () => transporteurUsersData?.data.map((tu) => tu.transporteur_id) ?? [],
    [transporteurUsersData]
  );

  const { tableProps, tableQueryResult } = useTable<Tournee>({
    syncWithLocation: true,
    ...(isTransporteur
      ? {
          filters: {
            permanent: [
              {
                field: "transporteur_id",
                operator: "in",
                value: transporteurList,
              },
            ],
          },
        }
      : {}),
    queryOptions: {
      enabled:
        Boolean(user) &&
        (isStaff || (isTransporteur && transporteurUsersStatus === "success")),
    },
  });

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
      collecteIsLoading ||
      transporteurIsLoading ||
      pointDeCollecteIsLoading ||
      (isTransporteur && transporteurUsersIsLoading),
    [
      tableProps.loading,
      collecteIsLoading,
      transporteurIsLoading,
      pointDeCollecteIsLoading,
      isTransporteur,
      transporteurUsersIsLoading,
    ]
  );

  return (
    <List title="Tournées" canCreate={true} breadcrumb={false}>
      <Table {...tableProps} loading={loading} rowKey="id">
        <Table.Column
          dataIndex={["date"]}
          title="Date"
          render={(value: any) => (
            <DateField value={value} format="ddd DD MMM YY" locales="fr" />
          )}
        />
        <Table.Column dataIndex="zone" title="Zone" />
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
          title="Chargement total"
          render={(_, record: BaseRecord) => {
            if (record.id) {
              const collectes = tourneeById[record.id].collectes;
              return <Chargement collectes={collectes} />;
            }
            return null;
          }}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
