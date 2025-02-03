import {
  IResourceComponentsProps,
  useList,
  useOne,
  useShow,
} from "@refinedev/core";
import { Mailing, MailTemplate, PointDeCollecte } from "../../types";
import { DateField, Show, TagField, TextField } from "@refinedev/antd";
import { Typography } from "antd";
import { useMemo } from "react";
import MailingSendButton from "../../components/mailing/MailingSendButton";
import { formatDate } from "../../utility/dateFormat";
import MailingRecapButton from "../../components/mailing/MailingRecapButton";

const { Title } = Typography;

const MailingShow: React.FC<IResourceComponentsProps> = () => {
  const { query } = useShow<Mailing>({ liveMode: "auto" });

  const { data, isLoading } = query;

  const mailing = data?.data;

  const { data: mailTemplateData } = useOne<MailTemplate>({
    resource: "mail_template",
    id: mailing?.mail_template_id ?? "",
    queryOptions: { enabled: !!mailing?.mail_template_id },
  });

  const { data: pointsDeCollecteData } = useList<PointDeCollecte>({
    resource: "point_de_collecte",
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: mailing?.point_de_collecte_ids ?? [],
      },
    ],
    queryOptions: {
      enabled:
        !!mailing?.point_de_collecte_ids &&
        mailing.point_de_collecte_ids.length > 0,
    },
  });

  const pointsDeCollecteList = useMemo(
    () => pointsDeCollecteData?.data ?? [],
    [pointsDeCollecteData]
  );

  return (
    <Show
      isLoading={isLoading}
      breadcrumb={false}
      headerButtons={(props) => [
        ...(mailing && mailing.statut === "En attente"
          ? [<MailingSendButton mailing={mailing} />]
          : []),
        ...(mailing && mailing.statut === "Envoyé"
          ? [<MailingRecapButton mailing={mailing} />]
          : []),
        props.defaultButtons,
      ]}
    >
      <Title level={5}>Date de création</Title>
      <DateField value={mailing?.created_at} />
      <Title level={5}>Gabarit de mail</Title>
      {mailTemplateData && <TextField value={mailTemplateData?.data.nom} />}
      <Title level={5}>Statut</Title>
      <TagField
        value={
          mailing?.statut === "Envoyé" && mailing.date_envoi
            ? `${mailing?.statut} le ${formatDate(mailing.date_envoi)}`
            : mailing?.statut
        }
      />
      <Title level={5}>Points de collecte</Title>
      <>
        {pointsDeCollecteList.map((p) => (
          <TagField value={p.nom} />
        ))}
      </>
    </Show>
  );
};

export default MailingShow;
