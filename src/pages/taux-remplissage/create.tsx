import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";

export const TauxDeRemplissageCreate: React.FC<
  IResourceComponentsProps
> = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  const { selectProps: pointDeCollecteSelectProps } = useSelect({
    resource: "point_de_collecte",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Created At"
          name={["created_at"]}
          rules={[
            {
              required: true,
            },
          ]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Nombre Contenant Plein"
          name={["nombre_contenant_plein"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Point De Collecte"
          name={"point_de_collecte"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...pointDeCollecteSelectProps} />
        </Form.Item>
      </Form>
    </Create>
  );
};
