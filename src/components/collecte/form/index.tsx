import {
  NumberField,
  UseModalFormReturnType,
  useSelect,
} from "@refinedev/antd";
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
      <Form.Item
        name="livraison_nb_casier_75_vide"
        label="Livraison - Nombre de casiers 75 vides"
      >
        <Input type="number" defaultValue={0} style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        name="livraison_nb_palox_vide"
        label="Livraison - Nombre de paloxs vides"
      >
        <Input type="number" defaultValue={0} style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        name="collecte_nb_casier_75_plein"
        label="Collecte - Nombre de casiers 75 pleins"
      >
        <Input type="number" defaultValue={0} style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        name="collecte_nb_palox_plein"
        label="Collecte - Nombre de paloxs pleins"
      >
        <Input type="number" defaultValue={0} style={{ width: 300 }} />
      </Form.Item>
    </Form>
  );
};
