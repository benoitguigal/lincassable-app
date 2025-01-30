import {
  IResourceComponentsProps,
  useList,
  useOne,
  useShow,
} from "@refinedev/core";
import { Mailing, MailTemplate, PointDeCollecte } from "../../types";
import { DateField, Show, TagField, TextField } from "@refinedev/antd";
import { Tag, Typography } from "antd";
import { useMemo } from "react";

const { Title } = Typography;

const MailingShow: React.FC<IResourceComponentsProps> = () => {
  const { query } = useShow<Mailing>();

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
    <Show isLoading={isLoading} breadcrumb={false}>
      <Title level={5}>Date de création</Title>
      <DateField value={mailing?.created_at} />
      <Title level={5}>Gabarit de mail</Title>
      {mailTemplateData && <TextField value={mailTemplateData?.data.nom} />}
      <Title level={5}>Statut</Title>
      <TagField value={mailing?.statut} />
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
