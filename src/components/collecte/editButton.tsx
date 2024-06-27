import { Button, Modal } from "antd";
import { ICollecteWithPointDeCollecte } from "../../pages/tournee/list";
import { EditOutlined } from "@ant-design/icons";
import { DeleteButton, useModalForm } from "@refinedev/antd";
import { ICollecte } from "../../interfaces";
import { CollecteForm } from "./form";
import { useDelete, useDeleteButton } from "@refinedev/core";

type CollecteEditButtonProps = {
  collecte: ICollecteWithPointDeCollecte;
};

export const CollecteEditButton: React.FC<CollecteEditButtonProps> = ({
  collecte,
}) => {
  const { modalProps, formProps, show, close } = useModalForm<ICollecte>({
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
        <CollecteForm formProps={formProps} />
      </Modal>
    </>
  );
};
