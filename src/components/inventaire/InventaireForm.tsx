import { UseFormReturnType, useSelect } from "@refinedev/antd";
import { Inventaire, PointDeCollecte } from "../../types";
import { DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";

type Props = UseFormReturnType<Inventaire>;

const positiveRule = {
  type: "number",
  min: -1,
  message: "Veuillez entrer un nombre positif ou égal à 0",
};

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
        style={{ width: 300 }}
        rules={[
          {
            validator: (_, value) =>
              value >= 0
                ? Promise.resolve()
                : Promise.reject(new Error("Doit être positif")),
          },
        ]}
        getValueFromEvent={(event) => {
          const value = event.target.value;
          return value === "" ? null : value;
        }}
      >
        <Input type="number" allowClear={true} min={0} />
      </Form.Item>
      <Form.Item
        name="stock_casiers_33"
        label="Stock casiers 33cl"
        style={{ width: 300 }}
        rules={[{ min: 0 }]}
        getValueFromEvent={(event) => {
          const value = event.target.value;
          return value === "" ? null : value;
        }}
      >
        <Input type="number" allowClear={true} min={0} />
      </Form.Item>
      <Form.Item
        name="stock_paloxs"
        label="Stock paloxs"
        style={{ width: 300 }}
        rules={[{ min: 0 }]}
        getValueFromEvent={(event) => {
          const value = event.target.value;
          return value === "" ? null : value;
        }}
      >
        <Input type="number" allowClear={true} min={0} />
      </Form.Item>
    </Form>
  );
};

export default InventaireForm;
