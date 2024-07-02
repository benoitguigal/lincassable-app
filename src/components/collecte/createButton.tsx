import { Button, Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useModalForm } from "@refinedev/antd";
import { ICollecte } from "../../interfaces";
import { CollecteForm } from "./form";

type CollecteCreateButtonProps = {
  tournee_id: number;
};

export const CollecteCreateButton: React.FC<CollecteCreateButtonProps> = ({
  tournee_id,
}) => {
  const { modalProps, formProps, show } = useModalForm<ICollecte>({
    resource: "collecte",
    action: "create",
    warnWhenUnsavedChanges: true,
  });

  return (
    <>
      <Button
        size="small"
        type="primary"
        shape="circle"
        icon={<PlusCircleOutlined />}
        onClick={() => show()}
      />
      <Modal {...modalProps}>
        <CollecteForm
          formProps={{
            ...formProps,
            initialValues: { ...formProps.initialValues, tournee_id },
          }}
        />
      </Modal>
    </>
  );
};
