import { Create, Edit, UseFormProps } from "@refinedev/antd";
import { usePointDeCollecteForm } from "./usePointDeCollecteForm";
import { PointDeCollecteForm } from ".";
import dayjs from "dayjs";

type Props = {
  action: UseFormProps["action"];
};

export const PointDeCollecteFormWrapper: React.FC<Props> = ({ action }) => {
  const form = usePointDeCollecteForm({ action });

  const onFinish = (values: any) => {
    const setup_date = dayjs.isDayjs(values.setup_date)
      ? values.date.format("YYYY-MM-DD")
      : values.setup_date;

    form.formProps.onFinish &&
      form.formProps.onFinish({ ...values, setup_date });
  };

  const modifiedForm = { ...form, formProps: { ...form.formProps, onFinish } };

  const CreateOrEdit = action === "create" ? Create : Edit;

  return (
    <CreateOrEdit saveButtonProps={form.saveButtonProps} breadcrumb={false}>
      <PointDeCollecteForm {...modifiedForm} />
    </CreateOrEdit>
  );
};
