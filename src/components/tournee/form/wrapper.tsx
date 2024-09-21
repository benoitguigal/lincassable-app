import { Create, Edit, UseFormProps, useForm } from "@refinedev/antd";
import { TourneeForm } from ".";
import { Tournee } from "../../../types";
import dayjs from "dayjs";

type Props = {
  action: UseFormProps["action"];
};

export const TourneeFormWrapper: React.FC<Props> = ({ action }) => {
  const form = useForm<Tournee>({ action });

  const CreateOrEdit = action === "create" ? Create : Edit;

  const onFinish = (values: any) => {
    const date = dayjs.isDayjs(values.date)
      ? values.date.format("YYYY-MM-DD")
      : values.date;

    form.formProps.onFinish && form.formProps.onFinish({ ...values, date });
  };

  const modifiedForm = { ...form, formProps: { ...form.formProps, onFinish } };

  return (
    <CreateOrEdit saveButtonProps={form.saveButtonProps} breadcrumb={false}>
      <TourneeForm form={modifiedForm} action={action} />
    </CreateOrEdit>
  );
};
