import { Edit, useForm } from "@refinedev/antd";
import { PointDeCollecteForm } from "../../components/pointsDeCollecte/form";

export const PointDeCollecteEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps} breadcrumb={false}>
      <PointDeCollecteForm {...formProps} />
    </Edit>
  );
};
