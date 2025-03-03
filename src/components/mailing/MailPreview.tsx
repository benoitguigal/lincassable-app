import { Card } from "antd";
import { Mail } from "../../types";
import MailStatusTag from "./MailStatusTag";

type Props = {
  mail: Mail;
};

const MailPreview: React.FC<Props> = ({ mail }) => {
  return (
    <Card
      title={
        <>
          {mail.to}
          {mail.statut !== "created" && (
            <span style={{ marginLeft: 5 }}>
              <MailStatusTag statut={mail.statut as any} />
            </span>
          )}
        </>
      }
    >
      <div>{mail.sujet}</div>
      <div
        style={{ marginTop: 5 }}
        dangerouslySetInnerHTML={{ __html: mail.corps ?? "" }}
      ></div>
    </Card>
  );
};

export default MailPreview;
