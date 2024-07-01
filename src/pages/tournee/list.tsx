import { BaseRecord, IResourceComponentsProps, useList } from "@refinedev/core";
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
  ICollecte,
  ICollecteItem,
  IPointDeCollecte,
  ITournee,
} from "../../interfaces";
import { useMemo } from "react";
import { Chargement } from "../../components/tournee/chargement";
import { CollecteEditButton } from "../../components/collecte/editButton";
import { CollecteCreateButton } from "../../components/collecte/createButton";

dayjs.locale("fr"); // use locale globally

export type ICollecteWithPointDeCollecte = ICollecte & {
  point_de_collecte?: IPointDeCollecte | null;
  items: ICollecteItem[];
};

export type ITourneeWithCollectes = ITournee & {
  collectes: ICollecteWithPointDeCollecte[];
};

export const TourneeList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, tableQueryResult } = useTable<ITournee>({
    syncWithLocation: true,
  });

  const tourneeList = useMemo(
    () => tableQueryResult?.data?.data ?? [],
    [tableQueryResult]
  );

  const { data: collectesData } = useList<ICollecte>({
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

  const { data: pointsDeCollecteData } = useList<IPointDeCollecte>({
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

  const { data: collecteItemsData } = useList<ICollecteItem>({
    resource: "chargement",
    filters: [
      {
        field: "collecte_id",
        operator: "in",
        value: collecteList.map((c) => c.id),
      },
    ],
    queryOptions: { enabled: collecteList && collecteList.length > 0 },
  });

  const collecteItemsList = useMemo(
    () => collecteItemsData?.data ?? [],
    [collecteItemsData]
  );

  const collecteListWithPointDeCollecte: ICollecteWithPointDeCollecte[] =
    useMemo(
      () =>
        collecteList.map((c) => ({
          ...c,
          point_de_collecte: pointsDeCollecteList.find(
            (pc) => pc.id === c.point_de_collecte_id
          ),
          items: collecteItemsList.filter((item) => item.collecte_id === c.id),
        })),
      [collecteList, pointsDeCollecteList, collecteItemsList]
    );

  const tourneeWithCollectes: ITourneeWithCollectes[] = useMemo(
    () =>
      tourneeList.map((t) => ({
        ...t,
        collectes: collecteListWithPointDeCollecte.filter(
          (c) => c.tournee_id === t.id
        ),
      })),
    [tourneeList, collecteListWithPointDeCollecte]
  );

  const tourneeById = tourneeWithCollectes.reduce<{
    [key: string]: ITourneeWithCollectes;
  }>((acc, t) => ({ ...acc, [t.id]: t }), {});

  return (
    <List title="Tournées" canCreate={true} breadcrumb={false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex={["date"]}
          title="Date"
          render={(value: any) => (
            <DateField value={value} format="ddd DD MMM YY" locales="fr" />
          )}
        />
        <Table.Column dataIndex="zone" title="Zone" />
        <Table.Column dataIndex="transporteur" title="Transporteur" />
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
