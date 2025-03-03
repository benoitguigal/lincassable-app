import { useList } from "@refinedev/core";
import { Mailing, Mail } from "../../types";
import { Flex, Spin } from "antd";
import MailPreview from "./MailPreview";

type Props = {
  mailing: Mailing;
};

const MailingPreview: React.FC<Props> = ({ mailing }) => {
  const { data: mailData, isLoading: mailLoading } = useList<Mail>({
    resource: "mail",
    pagination: { mode: "off" },
    filters: [{ field: "mailing_id", operator: "eq", value: mailing.id }],
  });

  if (mailLoading) {
    return <Spin />;
  }

  return (
    <Flex
      vertical
      gap={10}
      style={{ marginTop: 10, maxHeight: 500, overflow: "scroll" }}
    >
      {(mailData?.data ?? []).map((mail) => (
        <MailPreview mail={mail} />
      ))}
    </Flex>
  );
};

export default MailingPreview;
