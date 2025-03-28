import { Create, useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Inventaire } from "../../types";
import InventaireForm from "../../components/inventaire/InventaireForm";

const InventaireEdit: React.FC<IResourceComponentsProps> = () => {
  const form = useForm<Inventaire>({
    action: "edit",
  });

  return (
    <Create saveButtonProps={form.saveButtonProps} breadcrumb={false}>
      <InventaireForm {...form} />
    </Create>
  );
};

export default InventaireEdit;
