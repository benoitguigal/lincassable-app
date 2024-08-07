import { PointDeCollecte, Tournee, Transporteur } from "../../../types";
import dayjs from "dayjs";
import { DatePicker, Form, Select } from "antd";
import { UseFormProps, UseFormReturnType, useSelect } from "@refinedev/antd";
import { zoneDeCollecteOptions } from "../../../utility/options";
import CollecteListTable from "../../collecte/listTable";

type Props = {
  form: UseFormReturnType<Tournee>;
  action: UseFormProps["action"];
};

export const TourneeForm: React.FC<Props> = ({ form, action }) => {
  const { selectProps: pointDeMassificationSelectProps } =
    useSelect<PointDeCollecte>({
      resource: "point_de_collecte",
      optionLabel: "nom",
      filters: [{ field: "type", operator: "eq", value: "Massification" }],
    });

  const { selectProps: transporteurSelectProps } = useSelect<Transporteur>({
    resource: "transporteur",
    optionLabel: "nom",
  });

  return (
    <Form {...form.formProps} layout="vertical">
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
        name={["transporteur_id"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          style={{ width: 300 }}
          placeholder="Transporteur"
          {...transporteurSelectProps}
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

      {action === "edit" && (
        <CollecteListTable tournee_id={form.id as number} canEdit={true} />
      )}
    </Form>
  );
};
