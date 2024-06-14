import { AutoComplete, Form, Input, Select } from "antd";
import { pointDeCollecteTypeOptions } from "../../../utility/options";
import { LatLng } from "../../../utility/geocoding";
import debounce from "../../../utility/debounce";
import { FormListItem } from "../../form";
import { UseFormReturnType } from "@refinedev/antd";
import { IPointDeCollecte } from "../../../interfaces";
import { PointDeCollecteMap } from "./map";

type Props = UseFormReturnType<IPointDeCollecte> & {
  latLng: LatLng | null;
  handleAdresseSelected: (text: string) => void;
  handleAdresseSearch: (text: string) => void;
  handleDragEnd: (latLng: LatLng) => void;
  adressOptions: { value: string }[];
};

export const PointDeCollecteForm: React.FC<Props> = ({
  latLng,
  adressOptions,
  handleAdresseSearch,
  handleAdresseSelected,
  handleDragEnd,
  formProps,
}) => {
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
          options={adressOptions}
          style={{ width: "full" }}
          onSelect={handleAdresseSelected}
          onSearch={debounce(handleAdresseSearch)}
          placeholder="Rechercher une adresse"
        />
      </Form.Item>
      <Form.Item label="Latitude" name="latitude">
        <Input type="number" value={10} disabled={true} />
      </Form.Item>
      <Form.Item label="Longitude" name="longitude">
        <Input type="number" disabled={true} />
      </Form.Item>

      {latLng && (
        <PointDeCollecteMap latLng={latLng} handleDragEnd={handleDragEnd} />
      )}

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
