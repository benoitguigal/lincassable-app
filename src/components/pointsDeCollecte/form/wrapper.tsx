import { Create, Edit, UseFormProps } from "@refinedev/antd";
import { usePointDeCollecteForm } from "./usePointDeCollecteForm";
import { PointDeCollecteForm } from ".";

type Props = {
  action: UseFormProps["action"];
};

export const PointDeCollecteFormWrapper: React.FC<Props> = ({ action }) => {
  const form = usePointDeCollecteForm({ action });

  const CreateOrEdit = action === "create" ? Create : Edit;

  return (
    <CreateOrEdit saveButtonProps={form.saveButtonProps} breadcrumb={false}>
      <PointDeCollecteForm {...form} />
    </CreateOrEdit>
  );
};
