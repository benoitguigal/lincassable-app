import { UseFormReturnType, useSelect } from "@refinedev/antd";
import { Inventaire, PointDeCollecte } from "../../types";
import { Alert, DatePicker, Form, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { positiveRule } from "../../utility/validation";
import { useMemo } from "react";

type Props = UseFormReturnType<Inventaire>;

const InventaireForm: React.FC<Props> = ({ formProps }) => {
  const { selectProps: pointDeCollecteSelectProps, query } =
    useSelect<PointDeCollecte>({
      pagination: { mode: "off" },
      resource: "point_de_collecte",
      optionLabel: "nom",
      optionValue: "id",
    });

  const pointDeCollecteId = Form.useWatch(
    "point_de_collecte_id",
    formProps.form
  );

  const pointDeCollecte = useMemo(
    () => query.data?.data.find((pc) => pc.id === pointDeCollecteId),
    [query.data, pointDeCollecteId]
  );

  const isMassification =
    pointDeCollecte?.type === "Massification" ||
    pointDeCollecte?.type === "Tri";

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
          allowClear
        />
      </Form.Item>
      <Form.Item
        name="stock_casiers_75"
        label="Stock casiers 75cl"
        tooltip="Stock total (vides + pleins)"
        initialValue={0}
        style={{ width: 300 }}
        rules={[positiveRule, { required: true }]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        name="stock_casiers_75_plein"
        label="Stock casiers 75cl pleins"
        style={{ width: 300 }}
        hidden={!isMassification}
        rules={[
          positiveRule,
          {
            required: isMassification,
            message:
              "Ce champ est obligatoire pour les points de massification",
          },
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        name="stock_casiers_33"
        label="Stock casiers 33cl"
        tooltip="Stock total (vides + pleins)"
        initialValue={0}
        style={{ width: 300 }}
        rules={[positiveRule, { required: true }]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        name="stock_casiers_33_plein"
        label="Stock casiers 33cl pleins"
        style={{ width: 300 }}
        hidden={!isMassification}
        rules={[
          positiveRule,
          {
            required: isMassification,
            message:
              "Ce champ est obligatoire pour les points de massification",
          },
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        name="stock_paloxs"
        label="Stock paloxs"
        tooltip="Stock total (vides + pleins)"
        initialValue={0}
        style={{ width: 300 }}
        rules={[positiveRule, { required: true }]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        name="stock_paloxs_plein"
        label="Stock paloxs pleins"
        style={{ width: 300 }}
        hidden={!isMassification}
        rules={[
          positiveRule,
          {
            required: isMassification,
            message:
              "Ce champ est obligatoire pour les points de massification",
          },
        ]}
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
