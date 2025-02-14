import { Card } from "antd";
import { MailTemplate, PointDeCollecte } from "../../types";
import nunjucks from "nunjucks";
import { Json } from "../../types/supabase";
import renderVariables from "./helpers";
import MailStatusTag from "./MailStatusTag";

type Props = {
  email: string;
  pointDeCollecte: PointDeCollecte;
  mailTemplate: MailTemplate;
  variables?: Json;
  statut?: string | null;
};

const MailPreview: React.FC<Props> = ({
  email,
  pointDeCollecte,
  mailTemplate,
  variables,
  statut,
}) => {
  const formattedVariables = variables
    ? Object.fromEntries(
        Object.entries(variables).map(([key, value]) => {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (typeof value === "string" && dateRegex.test(value)) {
            const date = new Date(value);
            const formattedDate = date.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            });
            return [key, formattedDate];
          }
          return [key, value];
        })
      )
    : {};

  const html = nunjucks.renderString(mailTemplate.corps, {
    ...formattedVariables,
    ...renderVariables(pointDeCollecte),
  });

  return (
    <Card
      title={
        <>
          {email}
          {statut && (
            <span style={{ marginLeft: 5 }}>
              <MailStatusTag statut={statut as any} />
            </span>
          )}
        </>
      }
    >
      <div>{mailTemplate.sujet}</div>
      <div
        style={{ marginTop: 5 }}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </Card>
  );
};

export default MailPreview;
