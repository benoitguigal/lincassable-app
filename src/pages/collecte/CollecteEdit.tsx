import { Create, useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import CollecteForm from "../../components/collecte/CollecteForm";
import { Collecte } from "../../types";

const CollecteEdit: React.FC<IResourceComponentsProps> = () => {
  const form = useForm<Collecte>({ action: "edit" });

  return (
    <Create
      title="Modifier une collecte ou un apport direct du producteur"
      saveButtonProps={form.saveButtonProps}
      breadcrumb={false}
    >
      <CollecteForm {...form} />
    </Create>
  );
};

export default CollecteEdit;
