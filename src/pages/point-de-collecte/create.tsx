import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { pointDeCollecteTypeOptions } from "../../utility/options";
import { FormListItem } from "../../components";

export const PointDeCollecteCreate = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps} breadcrumb={false}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Nom"
          name={["nom"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Type de point de collecte" name="type">
          <Select
            options={pointDeCollecteTypeOptions}
            style={{ width: "200px" }}
            allowClear
            placeholder="Type de point de collecte"
          />
        </Form.Item>
        <Form.Item
          label="Adresse"
          name={["adresse"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Horaires" name={["horaires"]}>
          <Input />
        </Form.Item>
        <FormListItem
          name="contacts"
          label="Contacts"
          labelSingular="contact"
          placeholder="Nom du contact"
        />
        <FormListItem
          name="emails"
          label="E-mails"
          labelSingular="e-mail"
          placeholder="E-mail de contact"
        />
        <FormListItem
          name="telephones"
          label="Téléphones"
          labelSingular="télephone"
          placeholder="Téléphone du contact"
        />
      </Form>
    </Create>
  );
};
