import { Create, useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Palox } from "../../types";
import PaloxForm from "../../components/palox/PaloxForm";

const PaloxEdit: React.FC<IResourceComponentsProps> = () => {
  const form = useForm<Palox>({
    action: "edit",
  });

  return (
    <Create saveButtonProps={form.saveButtonProps} breadcrumb={false}>
      <PaloxForm {...form} />
    </Create>
  );
};

export default PaloxEdit;
