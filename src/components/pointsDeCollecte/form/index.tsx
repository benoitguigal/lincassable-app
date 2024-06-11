import { AutoComplete, Form, FormProps, Input, Select } from "antd";
import { pointDeCollecteTypeOptions } from "../../../utility/options";
import { useState } from "react";
import { Feature, autocomplete } from "../../../utility/geoapify";
import debounce from "../../../utility/debounce";
import { FormListItem } from "../../form";

export const PointDeCollecteForm: React.FC<FormProps> = (formProps) => {
  const [features, setFeatures] = useState<Feature[]>([]);

  async function onAddressSearch(text: string) {
    if (text && text.length > 3) {
      const features = await autocomplete(text);
      setFeatures(features);
    } else {
      setFeatures([]);
    }
  }

  function onSelect(text: string) {
    const f = features.find((f) => f.properties.formatted === text);
    if (f) {
      formProps.form?.setFieldValue("longitude", f.geometry.coordinates[0]);
      formProps.form?.setFieldValue("latitude", f.geometry.coordinates[1]);
    }
  }
  return (
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
        <AutoComplete
          options={features.map((f) => ({ value: f.properties.formatted }))}
          style={{ width: "full" }}
          onSelect={onSelect}
          onSearch={debounce(onAddressSearch)}
          placeholder="Rechercher une adresse"
        />
      </Form.Item>
      <Form.Item label="Latitude" name="latitude">
        <Input type="number" value={10} disabled={true} />
      </Form.Item>
      <Form.Item label="Longitude" name="longitude">
        <Input type="number" disabled={true} />
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
  );
};
