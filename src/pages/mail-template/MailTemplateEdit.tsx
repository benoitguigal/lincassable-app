import { Edit, useForm } from "@refinedev/antd";
import { IResourceComponents } from "@refinedev/core";
import { MailTemplate } from "../../types";
import MailTemplateForm from "../../components/mail-template/MailTemplateForm";

const MailTemplateEdit: React.FC<IResourceComponents> = () => {
  const form = useForm<MailTemplate>({ action: "edit" });

  return (
    <Edit
      title="Modifier un gabarit d'email"
      saveButtonProps={form.saveButtonProps}
      breadcrumb={false}
    >
      <MailTemplateForm {...form} />
    </Edit>
  );
};

export default MailTemplateEdit;
