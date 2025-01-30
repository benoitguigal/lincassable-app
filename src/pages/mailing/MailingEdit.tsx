import { Edit, useForm } from "@refinedev/antd";
import { IResourceComponents } from "@refinedev/core";
import { Mailing } from "../../types";
import MailingForm from "../../components/mailing/MailingForm";

const MailingEdit: React.FC<IResourceComponents> = () => {
  const form = useForm<Mailing>({ action: "edit" });

  return (
    <Edit
      title="Modifier un mailing"
      saveButtonProps={form.saveButtonProps}
      breadcrumb={false}
    >
      <MailingForm {...form} />
    </Edit>
  );
};

export default MailingEdit;
