import { Card, Tag } from "antd";
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
  const html = nunjucks.renderString(mailTemplate.corps, {
    ...(variables as { [key: string]: string }),
    ...renderVariables(pointDeCollecte),
  });

  return (
    <Card
      title={
        <>
          {email}
          {statut && (
            <span style={{ marginLeft: 5 }}>
              <MailStatusTag statut={statut as MailStatutEnum} />
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
