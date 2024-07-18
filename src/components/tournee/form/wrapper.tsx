import { Create, Edit, UseFormProps, useForm } from "@refinedev/antd";
import { TourneeForm } from ".";
import { Tournee } from "../../../types";

type Props = {
  action: UseFormProps["action"];
};

export const TourneeFormWrapper: React.FC<Props> = ({ action }) => {
  const form = useForm<Tournee>({ action });

  const CreateOrEdit = action === "create" ? Create : Edit;

  return (
    <CreateOrEdit saveButtonProps={form.saveButtonProps} breadcrumb={false}>
      <TourneeForm form={form} action={action} />
    </CreateOrEdit>
  );
};
