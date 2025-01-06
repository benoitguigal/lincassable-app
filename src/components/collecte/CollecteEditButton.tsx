import { Button, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { DeleteButton, useModalForm } from "@refinedev/antd";
import { Collecte, CollecteWithPointDeCollecte } from "../../types";
import CollecteForm from "./CollecteForm";

type CollecteEditButtonProps = {
  collecte: CollecteWithPointDeCollecte;
};

const CollecteEditButton: React.FC<CollecteEditButtonProps> = ({
  collecte,
}) => {
  const { modalProps, formProps, show, close } = useModalForm<Collecte>({
    resource: "collecte",
    action: "edit",
    warnWhenUnsavedChanges: true,
  });

  // const deleteButtonProps = useDeleteButton({
  //   resource: "collecte",
  //   id: collecte.id,
  // });

  return (
    <>
      <Button
        size="small"
        type="primary"
        shape="round"
        icon={<EditOutlined />}
        iconPosition="end"
        onClick={() => show(collecte.id)}
      >
        {collecte.point_de_collecte?.nom ?? ""}
      </Button>
      <Modal
        {...modalProps}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <DeleteButton
              resource="collecte"
              recordItemId={collecte.id}
              onSuccess={close}
            />
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        {modalProps.open && <CollecteForm formProps={formProps} />}
      </Modal>
    </>
  );
};

export default CollecteEditButton;
