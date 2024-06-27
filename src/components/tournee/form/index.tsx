import { IPointDeCollecte, ITournee } from "../../../interfaces";
import dayjs from "dayjs";
import { DatePicker, Form, FormProps, Select } from "antd";
import { UseFormReturnType, useSelect } from "@refinedev/antd";
import {
  transporteurOptions,
  zoneDeCollecteOptions,
} from "../../../utility/options";
import { FormListItem } from "../../form";

type Props = Pick<UseFormReturnType<ITournee>, "formProps">;

export const TourneeForm: React.FC<Props> = ({ formProps }) => {
  const { selectProps: pointDeCollecteSelectProps } =
    useSelect<IPointDeCollecte>({
      resource: "point_de_collecte",
      optionLabel: "nom",
    });

  const { selectProps: pointDeMassificationSelectProps } =
    useSelect<IPointDeCollecte>({
      resource: "point_de_collecte",
      optionLabel: "nom",
      filters: [{ field: "type", operator: "eq", value: "Massification" }],
    });

  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="Date"
        name={["date"]}
        rules={[
          {
            required: true,
          },
        ]}
        getValueProps={(value) => ({
          value: value ? dayjs(value) : undefined,
        })}
      >
        <DatePicker placeholder="Sélectionner une date" size="large" />
      </Form.Item>
      <Form.Item
        label="Zone"
        name={["zone"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          options={zoneDeCollecteOptions}
          style={{ width: "200px" }}
          allowClear
          placeholder="Zone"
        />
      </Form.Item>
      <Form.Item
        label="Transporteur"
        name={["transporteur"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          options={transporteurOptions}
          style={{ width: "200px" }}
          allowClear
          placeholder="Transporteur"
        />
      </Form.Item>
      <Form.Item
        label="Point de massification"
        name={["point_de_massification_id"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Choisir un point de massification"
          style={{ width: 300 }}
          {...pointDeMassificationSelectProps}
        />
      </Form.Item>

      <FormListItem
        label="Point de collecte"
        labelSingular="point de collecte"
        name="points_de_collecte"
      >
        <Select
          placeholder="Choisir un point de collecte"
          style={{ width: 300 }}
          {...pointDeCollecteSelectProps}
        />
      </FormListItem>
    </Form>
  );
};
