import { Card } from "antd";
import { MailTemplate, PointDeCollecte } from "../../types";

type Props = {
  email: string;
  pointDeCollecte: PointDeCollecte;
  mailTemplate: MailTemplate;
};

const MailPreview: React.FC<Props> = ({
  email,
  pointDeCollecte,
  mailTemplate,
}) => {
  return (
    <Card title={email}>
      <div>{mailTemplate.sujet}</div>
      <div
        style={{ marginTop: 5 }}
        dangerouslySetInnerHTML={{ __html: mailTemplate.corps }}
      ></div>
    </Card>
  );
};

export default MailPreview;
