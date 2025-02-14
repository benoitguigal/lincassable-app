import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Mailing, MailTemplate, PointDeCollecte } from "../../types";
import { Space, Table, Tag } from "antd";
import { useList } from "@refinedev/core";
import { useMemo } from "react";
import MailingSendButton from "../../components/mailing/MailingSendButton";
import { formatDate } from "../../utility/dateFormat";
import MailingRecapButton from "../../components/mailing/MailingRecapButton";

type Record = Mailing & { mail_template: Pick<MailTemplate, "nom"> };

const MailingList: React.FC = () => {
  const { tableProps, tableQuery } = useTable<Record>({
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      initial: [{ field: "created_at", order: "desc" }],
    },
    meta: {
      select: "*,mail_template(nom)",
    },
    liveMode: "auto",
  });

  const mailingList = tableQuery.data?.data ?? [];

  const { data: pointsDeCollecteData } = useList<PointDeCollecte>({
    resource: "point_de_collecte",
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: mailingList.flatMap((m) => m.point_de_collecte_ids),
      },
    ],
    queryOptions: {
      enabled: mailingList && mailingList.length > 0,
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

  const buttonDisabled = (record: Record) => record.statut !== "En attente";

  return (
    <List canCreate={true} breadcrumb={false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="created_at"
          title="Date de création"
          render={(value: string) => (
            <DateField value={value} format="ddd DD MMM YY" locales="fr" />
          )}
        />
        <Table.Column
          dataIndex="mail_template"
          title="Gabarit de mail"
          render={(mail_template: Record["mail_template"]) => mail_template.nom}
        />
        <Table.Column
          dataIndex="statut"
          title="Statut"
          render={(statut, record: Record) =>
            statut === "Envoyé" && record.date_envoi
              ? `${statut} le ${formatDate(record.date_envoi)}`
              : statut
          }
        />
        <Table.Column
          dataIndex="point_de_collecte_ids"
          title="Destinataires"
          render={(pointsDeCollecte: Record["point_de_collecte_ids"]) => {
            return (pointsDeCollecte ?? [])
              .map((p) => <Tag>{pointDeCollecteById[p]?.nom ?? ""}</Tag>)
              .filter(Boolean);
          }}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: Record) => {
            const disabled = buttonDisabled(record);
            return (
              <Space>
                <EditButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  disabled={disabled}
                />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  disabled={disabled}
                />
                {record.statut === "En attente" && (
                  <MailingSendButton mailing={record} />
                )}
                {record.statut === "Envoyé" && (
                  <MailingRecapButton mailing={record} />
                )}
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};

export default MailingList;
