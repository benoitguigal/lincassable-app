import { UseModalFormReturnType, useSelect } from "@refinedev/antd";
import { ICollecte, IPointDeCollecte } from "../../../interfaces";
import { Form, Input, Select } from "antd";

type Props = Pick<UseModalFormReturnType<ICollecte>, "formProps">;

export const CollecteForm: React.FC<Props> = ({ formProps }) => {
  const { selectProps } = useSelect<IPointDeCollecte>({
    resource: "point_de_collecte",
    optionLabel: "nom",
    optionValue: "id",
  });

  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        name="tournee_id"
        label="Identifiant de la tournée"
        hidden={true}
      >
        <Input />
      </Form.Item>
      <Form.Item name="point_de_collecte_id" label="Point de collecte">
        <Select
          placeholder="Choisir un point de collecte"
          style={{ width: 300 }}
          {...selectProps}
        />
      </Form.Item>
    </Form>
  );
};
