import { Create, useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import CollecteForm from "../../components/collecte/CollecteForm";
import { Collecte } from "../../types";

const CollecteCreate: React.FC<IResourceComponentsProps> = () => {
  const form = useForm<Collecte>({ action: "create" });

  return (
    <Create
      title="Ajouter une collecte ou un apport direct du producteur"
      saveButtonProps={form.saveButtonProps}
      breadcrumb={false}
    >
      <CollecteForm {...form} />
    </Create>
  );
};

export default CollecteCreate;
