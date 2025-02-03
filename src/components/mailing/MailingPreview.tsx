import { useList, useOne } from "@refinedev/core";
import {
  Mailing,
  MailStatut,
  MailTemplate,
  PointDeCollecte,
} from "../../types";
import { useMemo } from "react";
import { Flex, Spin } from "antd";
import MailPreview from "./MailPreview";

type Props = {
  mailing: Mailing;
};

const MailingPreview: React.FC<Props> = ({ mailing }) => {
  const { data: mailTemplateData, isLoading: mailTemplateLoading } =
    useOne<MailTemplate>({
      resource: "mail_template",
      id: mailing?.mail_template_id ?? "",
      queryOptions: { enabled: !!mailing?.mail_template_id },
    });

  const { data: pointsDeCollecteData, isLoading: pointDeCollecteLoading } =
    useList<PointDeCollecte>({
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

  const { data: mailStatutData, isLoading: mailStatutLoading } =
    useList<MailStatut>({
      resource: "mail_statut",
      pagination: { mode: "off" },
      filters: [{ field: "mailing_id", operator: "eq", value: mailing.id }],
    });

  const mailStatusByEmail: { [key: string]: string } = useMemo(() => {
    return (mailStatutData?.data ?? []).reduce(
      (acc, statut) => ({
        ...acc,
        [statut.email]: statut.statut,
      }),
      {}
    );
  }, [mailStatutData]);

  if (mailTemplateLoading || pointDeCollecteLoading || mailStatutLoading) {
    return <Spin />;
  }

  if (mailTemplateData?.data) {
    return (
      <Flex
        vertical
        gap={10}
        style={{ marginTop: 10, maxHeight: 500, overflow: "scroll" }}
      >
        {pointsDeCollecteList.flatMap((pc) =>
          pc.emails.map((email) => (
            <MailPreview
              email={email}
              pointDeCollecte={pc}
              mailTemplate={mailTemplateData?.data}
              variables={mailing.variables}
              statut={mailStatusByEmail[email]}
            />
          ))
        )}
      </Flex>
    );
  }

  return null;
};

export default MailingPreview;
