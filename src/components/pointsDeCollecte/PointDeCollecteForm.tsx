import { AutoComplete, Form, Input, InputNumber, Select } from "antd";
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
import { positiveRule } from "../../utility/validation";

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

  const { form } = formProps;
  const consigne = Form.useWatch("consigne", form);

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
      <Form.Item
        label="Type de point de collecte"
        name="type"
        rules={[
          {
            required: true,
          },
        ]}
      >
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
        // INC-68 - lorsqu'on clear ce champ sur un point de collecte existant,
        // on envoie `undefined` ce qui ne permet pas d'enlever la valeur existante.
        normalize={(value) => value ?? null}
      >
        <Select
          placeholder=""
          {...pointDeCollecteSelectProps}
          allowClear={true}
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
      <Form.Item label="Adresse numéro" name="adresse_numero" hidden>
        <Input />
      </Form.Item>
      <Form.Item label="Adresse rue" name="adresse_rue" hidden>
        <Input />
      </Form.Item>
      <Form.Item label="Adresse code postal" name="adresse_code_postal" hidden>
        <Input />
      </Form.Item>
      <Form.Item label="Adresse ville" name="adresse_ville" hidden>
        <Input />
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
      <FormListItem
        name="emails"
        label="E-mails"
        labelSingular="e-mail"
        rules={[{ type: "email", message: "Email non valide" }]}
      >
        <Input
          placeholder="E-mail de contact"
          type="email"
          style={{ width: "60%" }}
        />
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
        name="contenant_collecte_types"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          options={contenantDeCollecteTypeOptions}
          mode={"tags"}
          allowClear
          placeholder="Type de contenant"
        />
      </Form.Item>
      <Form.Item
        label="Stock casiers 75cl"
        rules={[positiveRule]}
        initialValue={0}
        tooltip="Stock total incluant le stock tampon, calculé automatiquement à partir des inventaires de stock et des collectes"
        name="stock_casiers_75"
      >
        <InputNumber min={0} disabled={true} />
      </Form.Item>
      <Form.Item
        label="Stock tampon de casiers 75cl"
        rules={[positiveRule]}
        initialValue={0}
        tooltip="Stock utilisé pour les rotations internes au sein du point de collecte"
        name="stock_casiers_75_tampon"
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="Stock casiers 33cl"
        rules={[positiveRule]}
        initialValue={0}
        tooltip="Stock total incluant le stock tampon, calculé automatiquement à partir des inventaires de stock et des collectes"
        name="stock_casiers_33"
      >
        <InputNumber min={0} disabled={true} />
      </Form.Item>
      <Form.Item
        label="Stock tampon casiers 33cl"
        rules={[positiveRule]}
        initialValue={0}
        tooltip="Stock utilisé pour les rotations internes au sein du point de collecte"
        name="stock_casiers_33_tampon"
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="Stock paloxs"
        rules={[positiveRule]}
        initialValue={0}
        name="stock_paloxs"
        tooltip="Calculé automatiquement à partir des inventaires de stock et des collectes"
      >
        <InputNumber min={0} disabled={true} />
      </Form.Item>
      <Form.Item label="Pratiques la consigne" name="consigne">
        <Select
          options={[
            { value: true, label: "Oui" },
            { value: false, label: "Non" },
          ]}
        />
      </Form.Item>
      {consigne && (
        <FormListItem
          name="emails_consigne"
          label="E-mails consigne"
          labelSingular="e-mail"
          rules={[{ type: "email", message: "Email non valide" }]}
        >
          <Input
            placeholder="E-mail de contact"
            type="email"
            style={{ width: "60%" }}
          />
        </FormListItem>
      )}

      <Form.Item
        label="Inclure dans les prévisions de collecte"
        name="previsible"
      >
        <Select
          options={[
            { value: true, label: "Oui" },
            { value: false, label: "Non" },
          ]}
        />
      </Form.Item>
      <Form.Item label="Informations complémentaires" name="info">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default PointDeCollecteForm;
