import { UseFormReturnType, useSelect } from "@refinedev/antd";
import { Palox, PointDeCollecte } from "../../types";
import { Form, Input, Select } from "antd";
import { statutPaloxOptions } from "../../utility/options";

type Props = UseFormReturnType<Palox>;

const formatBouteilleTriOptions = [
  "Bière 75cl - Verallia Ebène",
  "Bière 75cl - Verallia Ambre",
  "Bière 75cl - Vidrala-Wiegand",
  "Vin Borderlaise cannelle",
  "Vin Bordelaise blanche",
  "Vin Bourgogne 63mm cannelle",
  "Vin Bourgogne 63mm feuille morte",
  "Vin Bourgogne 63mm blanche",
  "Pétillant / Méthode Trad",
  "Eau gazeuse 75cl",
  "Jus Natura 1L",
  "Fraîcheur 1L LAIT",
].map((value) => ({ value, label: value }));

const PaloxForm: React.FC<Props> = ({ formProps }) => {
  const { selectProps: pointDeCollecteSelectProps } =
    useSelect<PointDeCollecte>({
      pagination: { mode: "off" },
      resource: "point_de_collecte",
      optionLabel: "nom",
      optionValue: "id",
    });

  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="Numéro"
        name="numero"
        style={{ width: 300 }}
        rules={[{ required: true }]}
      >
        <Input placeholder="INC-XXXXX" />
      </Form.Item>
      <Form.Item label="Statut" name="statut" style={{ width: 300 }}>
        <Select options={statutPaloxOptions} placeholder="Statut" allowClear />
      </Form.Item>
      <Form.Item name="point_de_collecte_id" label="Localisation">
        <Select
          {...pointDeCollecteSelectProps}
          style={{ width: 300 }}
          placeholder="Point de collecte / massification"
        />
      </Form.Item>
      <Form.Item name="model" label="Modèle">
        <Select
          options={[{ value: "France Fil Bourgogne Tradition" }]}
          style={{ width: 300 }}
        />
      </Form.Item>
      <Form.Item name="format_tri" label="Format tri">
        <Select options={formatBouteilleTriOptions} style={{ width: 300 }} />
      </Form.Item>
    </Form>
  );
};

export default PaloxForm;
