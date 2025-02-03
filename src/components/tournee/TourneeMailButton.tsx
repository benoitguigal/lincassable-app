import { MailOutlined } from "@ant-design/icons";
import { useModalForm } from "@refinedev/antd";
import { Button, Modal } from "antd";
import { Collecte, Mailing, Tournee } from "../../types";
import { CanAccess } from "@refinedev/core";
import MailingForm from "../mailing/MailingForm";
import dayjs from "dayjs";

type Props = { tournee?: Tournee & { collecte: Collecte[] } };

const TourneeMailButton: React.FC<Props> = ({ tournee }) => {
  const modalForm = useModalForm<Mailing>({
    resource: "mailing",
    action: "create",
    warnWhenUnsavedChanges: true,
    redirect: "list",
  });

  modalForm.formProps.initialValues;

  return (
    <CanAccess resource="mailing" action="create">
      <>
        <Button
          icon={<MailOutlined />}
          title="Mail de confirmation"
          onClick={() => modalForm.show()}
        >
          Mail de confirmation
        </Button>
        {modalForm.modalProps.open && (
          <Modal {...modalForm.modalProps}>
            <MailingForm
              {...modalForm}
              formProps={{
                ...modalForm.formProps,
                initialValues: {
                  ...modalForm.formProps.initialValues,
                  mail_template_id: 2,
                  point_de_collecte_ids: (tournee?.collecte ?? []).map(
                    (c) => c.point_de_collecte_id
                  ),
                  variables: {
                    dateTournee: dayjs(tournee?.date).format("YYYY-MM-DD"),
                  },
                },
              }}
            />
          </Modal>
        )}
      </>
    </CanAccess>
  );
};

export default TourneeMailButton;
