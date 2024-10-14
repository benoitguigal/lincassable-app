import {
  PointDeCollecte,
  Tournee,
  Transporteur,
  ZoneDeCollecte,
} from "../../../types";
import dayjs from "dayjs";
import { DatePicker, Form, Input, Select, Typography } from "antd";
import { UseFormProps, UseFormReturnType, useSelect } from "@refinedev/antd";
import CollecteListTable from "../../collecte/listTable";
import { statutTourneeOptions } from "../../../utility/options";
import { usePermissions } from "@refinedev/core";
import { PermissionResponse } from "../../../authProvider";
import BonDeTourneeUpload from "../bon-de-tournee-upload";
import { useMemo } from "react";

const { Title } = Typography;

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

  const { selectProps: zoneDeCollecteSelectProps, query: zoneDeCollecteQuery } =
    useSelect<ZoneDeCollecte>({
      resource: "zone_de_collecte",
      optionLabel: "nom",
      optionValue: "id",
    });

  const { data: permissions } = usePermissions<PermissionResponse>();
  const isStaff = permissions?.role === "staff";

  const tournee = useMemo(() => {
    return form?.query?.data?.data;
  }, [form]);

  const zoneDeCollecte = useMemo(() => {
    if (!tournee) {
      return null;
    }
    return (zoneDeCollecteQuery.data?.data ?? []).find(
      (z) => z.id === tournee.zone_de_collecte_id
    );
  }, [tournee, zoneDeCollecteQuery]);

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
          disabled={!isStaff}
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
          disabled={!isStaff}
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
          disabled={!isStaff}
        />
      </Form.Item>
      <Form.Item label="Prix" name={["prix"]}>
        <Input style={{ width: 300 }} type="number" />
      </Form.Item>
      {action === "edit" && tournee && zoneDeCollecte && (
        <div style={{ marginBottom: 5, width: 300 }}>
          <p>Bon de tournée complété</p>
          <BonDeTourneeUpload
            tournee={tournee}
            zoneDeCollecte={zoneDeCollecte}
          />
        </div>
      )}
      {action === "edit" && isStaff && (
        <CollecteListTable tournee_id={form.id as number} canEdit={true} />
      )}
    </Form>
  );
};
