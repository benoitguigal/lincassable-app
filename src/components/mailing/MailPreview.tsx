import { Card } from "antd";
import { MailTemplate, PointDeCollecte } from "../../types";
import nunjucks from "nunjucks";
import { Json } from "../../types/supabase";
import renderVariables from "./helpers";

type Props = {
  email: string;
  pointDeCollecte: PointDeCollecte;
  mailTemplate: MailTemplate;
  variables?: Json;
};

const MailPreview: React.FC<Props> = ({
  email,
  pointDeCollecte,
  mailTemplate,
  variables,
}) => {
  const html = nunjucks.renderString(mailTemplate.corps, {
    ...(variables as { [key: string]: string }),
    ...renderVariables(pointDeCollecte),
  });

  return (
    <Card title={email}>
      <div>{mailTemplate.sujet}</div>
      <div
        style={{ marginTop: 5 }}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </Card>
  );
};

export default MailPreview;
