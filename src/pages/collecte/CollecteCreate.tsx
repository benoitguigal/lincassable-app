import { Create, useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import CollecteForm from "../../components/collecte/CollecteForm";
import { Collecte } from "../../types";

const CollecteCreate: React.FC<IResourceComponentsProps> = () => {
  const form = useForm<Collecte>({ action: "create" });

  return (
    <Create>
      <CollecteForm {...form} />
    </Create>
  );
};

export default CollecteCreate;
