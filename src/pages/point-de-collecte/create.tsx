import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { pointDeCollecteTypeOptions } from "../../utility/options";
import { FormListItem } from "../../components";
import { PointDeCollecteForm } from "../../components/pointsDeCollecte/form";

export const PointDeCollecteCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps} breadcrumb={false}>
      <PointDeCollecteForm {...formProps} />
    </Create>
  );
};
