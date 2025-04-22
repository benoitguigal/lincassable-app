import { UseFormReturnType, useSelect } from "@refinedev/antd";
import { Inventaire, PointDeCollecte } from "../../types";
import { Alert, DatePicker, Form, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { positiveRule } from "../../utility/validation";

type Props = UseFormReturnType<Inventaire>;

const InventaireForm: React.FC<Props> = ({ formProps }) => {
  const { selectProps: pointDeCollecteSelectProps } =
    useSelect<PointDeCollecte>({
      pagination: { mode: "off" },
      resource: "point_de_collecte",
      optionLabel: "nom",
      optionValue: "id",
    });

  return (
    <Form
      {...formProps}
      initialValues={{
        ...formProps.initialValues,
        date: formProps.initialValues?.date
          ? dayjs(formProps.initialValues.date)
          : dayjs(),
      }}
      layout="vertical"
    >
      <Form.Item label="Date" name="date" style={{ width: 300 }}>
        <DatePicker
          type="datetime-local"
          showTime
          format="YYYY-MM-DD HH:mm:ss"
        />
      </Form.Item>
      <Form.Item
        name="point_de_collecte_id"
        label="Point de collecte / massification"
        rules={[{ required: true }]}
      >
        <Select
          {...pointDeCollecteSelectProps}
          style={{ width: 300 }}
          placeholder="Point de collecte"
        />
      </Form.Item>
      <Form.Item
        name="stock_casiers_75"
        label="Stock casiers 75cl"
        initialValue={0}
        style={{ width: 300 }}
        rules={[positiveRule, { required: true }]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        name="stock_casiers_33"
        label="Stock casiers 33cl"
        initialValue={0}
        style={{ width: 300 }}
        rules={[positiveRule, { required: true }]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        name="stock_paloxs"
        initialValue={0}
        label="Stock paloxs"
        style={{ width: 300 }}
        rules={[positiveRule, { required: true }]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Alert
        type="info"
        message={
          "Une fois l'inventaire de stock renseigné," +
          " les stocks des contenants se calculent automatiquement" +
          " à partir des collectes qui ont lieu après la date" +
          " de l'inventaire"
        }
      />
    </Form>
  );
};

export default InventaireForm;
