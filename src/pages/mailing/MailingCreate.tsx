import { IResourceComponentsProps } from "@refinedev/core";
import { Mailing } from "../../types";
import { Create, useForm } from "@refinedev/antd";
import MailingForm from "../../components/mailing/MailingForm";

const MailingCreate: React.FC<IResourceComponentsProps> = () => {
  const form = useForm<Mailing>({ action: "create" });

  return (
    <Create
      title="Créer un mailing"
      saveButtonProps={{ ...form.saveButtonProps, title: "toto" }}
      breadcrumb={false}
    >
      <MailingForm {...form} />
    </Create>
  );
};

export default MailingCreate;
