import { Button, Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useModalForm } from "@refinedev/antd";
import { Collecte } from "../../types";
import CollecteForm from "./CollecteForm";
import { CanAccess, usePermissions } from "@refinedev/core";
import { PermissionResponse } from "../../authProvider";

type CollecteCreateButtonProps = {
  tournee_id: number;
};

const CollecteCreateButton: React.FC<CollecteCreateButtonProps> = ({
  tournee_id,
}) => {
  const { modalProps, formProps, show } = useModalForm<Collecte>({
    resource: "collecte",
    action: "create",
    warnWhenUnsavedChanges: true,
  });

  const { data: permissions } = usePermissions<PermissionResponse>();
  const isStaff = permissions?.role === "staff";

  return (
    <CanAccess resource="tournee" action="edit">
      <Button
        size="small"
        type="primary"
        shape="circle"
        disabled={!isStaff}
        icon={<PlusCircleOutlined />}
        onClick={() => show()}
      />

      <Modal {...modalProps}>
        {modalProps.open && (
          <CollecteForm
            formProps={{
              ...formProps,
              initialValues: { ...formProps.initialValues, tournee_id },
            }}
          />
        )}
      </Modal>
    </CanAccess>
  );
};

export default CollecteCreateButton;
