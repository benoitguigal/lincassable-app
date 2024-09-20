import {
  PointDeCollecte,
  Tournee,
  Transporteur,
  ZoneDeCollecte,
} from "../../../types";
import dayjs from "dayjs";
import { DatePicker, Form, Input, Select } from "antd";
import { UseFormProps, UseFormReturnType, useSelect } from "@refinedev/antd";
import CollecteListTable from "../../collecte/listTable";
import { statutTourneeOptions } from "../../../utility/options";

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

  const { selectProps: zoneDeCollecteSelectProps } = useSelect<ZoneDeCollecte>({
    resource: "zone_de_collecte",
    optionLabel: "nom",
    optionValue: "id",
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
      <Form.Item label="Zone de collecte" name={["zone_de_collecte_id"]}>
        <Select
          placeholder="Sélectionner une zone"
          style={{ width: 300 }}
          {...zoneDeCollecteSelectProps}
        />
      </Form.Item>
      <Form.Item label="Statut" name={["statut"]}>
        <Select style={{ width: 300 }} options={statutTourneeOptions} />
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
      <Form.Item label="Prix" name={["prix"]}>
        <Input style={{ width: 300 }} type="number" />
      </Form.Item>

      {action === "edit" && (
        <CollecteListTable tournee_id={form.id as number} canEdit={true} />
      )}
    </Form>
  );
};
