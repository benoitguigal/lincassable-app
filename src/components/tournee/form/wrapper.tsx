import { Create, Edit, UseFormProps, useForm } from "@refinedev/antd";
import { TourneeForm } from ".";
import { ITournee } from "../../../interfaces";

type Props = {
  action: UseFormProps["action"];
};

export const TourneeFormWrapper: React.FC<Props> = ({ action }) => {
  const form = useForm<ITournee>({ action });

  const CreateOrEdit = action === "create" ? Create : Edit;

  return (
    <CreateOrEdit saveButtonProps={form.saveButtonProps} breadcrumb={false}>
      <TourneeForm formProps={form.formProps} />
    </CreateOrEdit>
  );
};
