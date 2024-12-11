import { AutoComplete, Form, Input, Select } from "antd";
import {
  contenantDeCollecteTypeOptions,
  pointDeCollecteTypeOptions,
} from "../../utility/options";
import { LatLng } from "../../utility/geocoding";
import debounce from "../../utility/debounce";
import { UseFormReturnType, useSelect } from "@refinedev/antd";
import { PointDeCollecte, ZoneDeCollecte } from "../../types";
import PointDeCollecteMap from "./PointDeCollecteMap";
import FormListItem from "../FormListItem";

type Props = UseFormReturnType<PointDeCollecte> & {
  latLng: Partial<LatLng> | null;
  handleAdresseSelected: (text: string) => void;
  handleAdresseSearch: (text: string) => void;
  handleDragEnd: (latLng: LatLng) => void;
  handleLatitudeChange: (latitude: string) => void;
  handleLongitudeChange: (longitude: string) => void;
  adressOptions: { value: string }[];
};

const PointDeCollecteForm: React.FC<Props> = ({
  latLng,
  adressOptions,
  handleAdresseSearch,
  handleAdresseSelected,
  handleDragEnd,
  handleLatitudeChange,
  handleLongitudeChange,
  formProps,
}) => {
  const { selectProps: zoneDeCollecteSelectProps } = useSelect<ZoneDeCollecte>({
    resource: "zone_de_collecte",
    optionLabel: "nom",
    optionValue: "id",
  });

  const { selectProps: pointDeCollecteSelectProps } =
    useSelect<PointDeCollecte>({
      resource: "point_de_collecte",
      optionLabel: "nom",
      optionValue: "id",
      filters: [
        { field: "type", value: ["Producteur", "Magasin"], operator: "in" },
      ],
    });

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
      <Form.Item label="Date setup" name={["setup_date"]}>
        <Input type="date" />
      </Form.Item>
      <Form.Item label="Statut" name={["statut"]}>
        <Select
          placeholder="Statut"
          options={[
            { value: "actif", label: "Actif" },
            { value: "archive", label: "Archivé" },
          ]}
        />
      </Form.Item>
      <Form.Item label="Type de point de collecte" name="type">
        <Select
          options={pointDeCollecteTypeOptions}
          allowClear
          placeholder="Type de point de collecte"
        />
      </Form.Item>
      <Form.Item
        label="Collecté via"
        name="collecte_par_id"
        help="À renseigner pour les points de collecte secondaires"
        style={{ marginBottom: "2em" }}
      >
        <Select
          allowClear={true}
          placeholder=""
          {...pointDeCollecteSelectProps}
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
        <Input
          type="number"
          onChange={(e) => handleLatitudeChange(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Longitude" name="longitude">
        <Input
          type="number"
          onChange={(e) => handleLongitudeChange(e.target.value)}
        />
      </Form.Item>

      {latLng && latLng.lat && latLng.lng && (
        <PointDeCollecteMap
          latLng={{ lat: latLng.lat, lng: latLng.lng }}
          handleDragEnd={handleDragEnd}
        />
      )}
      <Form.Item label="Zone de collecte" name={["zone_de_collecte_id"]}>
        <Select
          placeholder="Sélectionner une zone"
          {...zoneDeCollecteSelectProps}
        />
      </Form.Item>

      <Form.Item label="Horaires" name={["horaires"]}>
        <Input />
      </Form.Item>
      <FormListItem name="contacts" label="Contacts" labelSingular="contact">
        <Input placeholder="Nom du contact" style={{ width: "60%" }} />
      </FormListItem>
      <FormListItem name="emails" label="E-mails" labelSingular="e-mail">
        <Input placeholder="E-mail de contact" style={{ width: "60%" }} />
      </FormListItem>
      <FormListItem
        name="telephones"
        label="Téléphones"
        labelSingular="télephone"
      >
        <Input placeholder="Téléphone du contact" style={{ width: "60%" }} />
      </FormListItem>
      <Form.Item
        label="Type de contenants de collecte"
        name="contenant_collecte_type"
      >
        <Select
          options={contenantDeCollecteTypeOptions}
          allowClear
          placeholder="Type de contenant"
        />
      </Form.Item>
      <Form.Item label="Stock casiers 75cl" name="stock_casiers_75">
        <Input type="number" min={0} />
      </Form.Item>
      <Form.Item label="Stock paloxs" name="stock_paloxs">
        <Input type="number" min={0} />
      </Form.Item>
      <Form.Item label="Informations complémentaires" name="info">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default PointDeCollecteForm;
