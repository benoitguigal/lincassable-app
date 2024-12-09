import { UseModalFormReturnType, useSelect } from "@refinedev/antd";
import { Checkbox, Flex, Form, Input, Select } from "antd";
import { Collecte, PointDeCollecte } from "../../../types";
import { useEffect, useMemo, useState } from "react";
import Decimal from "decimal.js";

type Props = Pick<UseModalFormReturnType<Collecte>, "formProps">;

const paletteOptions = [
  { value: null, label: "-" },
  { value: "Europe", label: "Palette Europe - 80*120" },
  { value: "VMF", label: "Palette VMF - 100*120" },
];

export const CollecteForm: React.FC<Props> = ({ formProps }) => {
  const { selectProps } = useSelect<PointDeCollecte>({
    resource: "point_de_collecte",
    optionLabel: "nom",
    optionValue: "id",
  });

  const { form, initialValues } = formProps;

  const handleCollecteChange = () => {
    const nbCasiers = form?.getFieldValue("collecte_nb_casier_75_plein") ?? 0;
    const nbPaloxs = form?.getFieldValue("collecte_nb_palox_plein") ?? 0;
    const nbPalettes =
      form?.getFieldValue("collecte_nb_palette_bouteille") ?? 0;
    const nbBouteilles = nbCasiers * 12 + nbPaloxs * 550 + nbPalettes * 1200;
    form?.setFieldValue("collecte_nb_bouteilles", nbBouteilles);
  };

  const [hasCasier, setHasCasier] = useState(false);
  const [hasPalox, setHasPalox] = useState(false);
  const [hasPaletteBouteilles, setHasPaletteBouteilles] = useState(false);
  const [hasFuts, setHasFuts] = useState(false);
  const [hasPaletteVide, setHasPaletteVide] = useState(false);

  function resetCasiers() {
    form?.setFieldValue("collecte_nb_casier_75_plein", 0);
    form?.setFieldValue("collecte_casier_75_plein_nb_palette", 0);
    form?.setFieldValue("livraison_nb_casier_75_vide", 0);
    form?.setFieldValue("livraison_casier_75_vide_nb_palette", 0);
    form?.setFieldValue("collecte_casier_75_plein_palette_type", null);
    form?.setFieldValue("livraison_casier_75_vide_palette_type", null);
  }

  function resetPaloxs() {
    form?.setFieldValue("collecte_nb_palox_plein", 0);
    form?.setFieldValue("livraison_nb_palox_vide", 0);
  }

  function resetPaletteBouteilles() {
    form?.setFieldValue("livraison_nb_palette_bouteille", 0);
    form?.setFieldValue("collecte_nb_palette_bouteille", 0);
  }

  function resetFuts() {
    form?.setFieldValue("collecte_nb_fut_vide", 0);
    form?.setFieldValue("livraison_nb_fut_vide", 0);
    form?.setFieldValue("collecte_fut_nb_palette", 0);
    form?.setFieldValue("livraison_fut_nb_palette", 0);
    form?.setFieldValue("collecte_fut_palette_type", null);
    form?.setFieldValue("livraison_fut_palette_type", null);
  }

  function resetPaletteVide() {
    form?.setFieldValue("collecte_nb_palette_vide", 0);
    form?.setFieldValue("collecte_palette_vide_type", null);
    form?.setFieldValue("livraison_nb_palette_vide", 0);
    form?.setFieldValue("livraison_palette_vide_type", null);
  }

  // Nombre de casiers pleins à collecter
  const collecteNbCasierPleins = Form.useWatch(
    "collecte_nb_casier_75_plein",
    form
  );

  // Nombre de palettes pour le conditionnement
  // des casiers pleins à collecter
  const collecteNbCasierPalette = Form.useWatch(
    "collecte_casier_75_plein_nb_palette",
    form
  );

  // Type de palette pour la collecte des casiers
  const collecteCasierPaletteType = Form.useWatch(
    "collecte_casier_75_plein_palette_type",
    form
  );

  // Nombre de casier pleins à collecter par palette
  const collecteNbCasierParPalette = useMemo(() => {
    if (collecteNbCasierPalette > 0) {
      return new Decimal(collecteNbCasierPleins)
        .dividedBy(collecteNbCasierPalette)
        .toDecimalPlaces(0);
    }
    return 0;
  }, [collecteNbCasierPleins, collecteNbCasierPalette]);

  // Nombre de casiers vides à livrer
  const livraisonNbCasierVides = Form.useWatch(
    "livraison_nb_casier_75_vide",
    form
  );

  // Nombre de palettes pour le conditionnement
  // des casiers vides à livrer
  const livraisonNbCasierPalette = Form.useWatch(
    "livraison_casier_75_vide_nb_palette",
    form
  );

  // Type de palette pour la livraison des palettes
  const livraisonCasierPaletteType = Form.useWatch(
    "livraison_casier_75_vide_palette_type",
    form
  );

  // Nombre de casier vides à livrer par palette
  const livraisonNbCasierParPalette = useMemo(() => {
    if (livraisonNbCasierPalette > 0) {
      return new Decimal(livraisonNbCasierVides)
        .dividedBy(livraisonNbCasierPalette)
        .toDecimalPlaces(0);
    }
    return 0;
  }, [livraisonNbCasierVides, livraisonNbCasierPalette]);

  // Nombre de fûts à collecter
  const collecteNbFuts = Form.useWatch("collecte_nb_fut_vide", form);

  // Nombre de palettes pour le conditionnement
  // des fûts à collecter
  const collecteFutNbPalettes = Form.useWatch("collecte_fut_nb_palette", form);

  // Type de palette pour la collecte des fûts
  const collecteFutsPaletteType = Form.useWatch(
    "collecte_fut_palette_type",
    form
  );

  // Nombre de fûts à collecter par palette
  const collecteNbFutsParPalette = useMemo(() => {
    if (collecteFutNbPalettes > 0) {
      return new Decimal(collecteNbFuts)
        .dividedBy(collecteFutNbPalettes)
        .toDecimalPlaces(0);
    }
    return 0;
  }, [collecteNbFuts, collecteFutNbPalettes]);

  // Nombre de fûts à livrer
  const livraisonNbFuts = Form.useWatch("livraison_nb_fut_vide", form);

  // Nombre de palettes pour le conditionnement
  // des fûts à livrer
  const livraisonFutNbPalettes = Form.useWatch(
    "livraison_fut_nb_palette",
    form
  );

  // Type de palette pour la livraison des fûts
  const livraisonFutsPaletteType = Form.useWatch(
    "livraison_fut_palette_type",
    form
  );

  // Nombre de fûts à collecter par palette
  const livraisonNbFutsParPalette = useMemo(() => {
    if (livraisonFutNbPalettes > 0) {
      return new Decimal(livraisonNbFuts)
        .dividedBy(livraisonFutNbPalettes)
        .toDecimalPlaces(0);
    }
    return 0;
  }, [livraisonFutNbPalettes, livraisonNbFuts]);

  useEffect(() => {
    if (
      initialValues?.collecte_nb_casier_75_plein ||
      initialValues?.livraison_nb_casier_75_vide
    ) {
      setHasCasier(true);
    }

    if (
      initialValues?.collecte_nb_palox_plein ||
      initialValues?.livraison_nb_palox_vide
    ) {
      setHasPalox(true);
    }
    if (
      initialValues?.livraison_nb_palette_bouteille ||
      initialValues?.collecte_nb_palette_bouteille
    ) {
      setHasPaletteBouteilles(true);
    }
    if (
      initialValues?.livraison_nb_fut_vide ||
      initialValues?.collecte_nb_fut_vide
    ) {
      setHasFuts(true);
    }

    if (
      initialValues?.collecte_nb_palette_vide ||
      initialValues?.livraison_nb_palette_vide
    ) {
      setHasPaletteVide(true);
    }
  }, [initialValues]);

  return (
    <Form {...formProps} layout="vertical" style={{ marginTop: "1em" }}>
      <Form.Item
        name="tournee_id"
        label="Identifiant de la tournée"
        hidden={true}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="point_de_collecte_id"
        label="Point de collecte"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Choisir un point de collecte"
          style={{ width: 300 }}
          {...selectProps}
        />
      </Form.Item>
      <Flex vertical gap="middle">
        <Checkbox
          checked={hasCasier}
          onChange={(e) => {
            const checked = e.target.checked;
            setHasCasier(e.target.checked);
            if (checked === false) {
              resetCasiers();
            }
          }}
        >
          Casiers 75cl
        </Checkbox>

        <Flex gap="middle" hidden={!hasCasier}>
          <Form.Item
            name="collecte_nb_casier_75_plein"
            label={
              <span>
                <b>Collecte</b> - Nombre de casiers 12x75cl pleins
              </span>
            }
          >
            <Input
              type="number"
              defaultValue={0}
              style={{ width: 300 }}
              onChange={() => {
                handleCollecteChange();
              }}
              min={0}
            />
          </Form.Item>
          <Form.Item
            label="Type de palette"
            name="collecte_casier_75_plein_palette_type"
          >
            <Select
              options={paletteOptions}
              style={{ width: 300 }}
              onChange={(v) => {
                if (v === null) {
                  form?.setFieldValue("collecte_casier_75_plein_nb_palette", 0);
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="collecte_casier_75_plein_nb_palette"
            label="Nombre de palettes"
            hidden={collecteCasierPaletteType === null}
            help={
              collecteNbCasierPalette > 0
                ? `${collecteNbCasierPalette} palettes de ${collecteNbCasierParPalette} casiers`
                : ""
            }
          >
            <Input
              type="number"
              defaultValue={0}
              style={{ width: 300 }}
              min={0}
            />
          </Form.Item>
        </Flex>

        <Flex gap="middle" hidden={!hasCasier}>
          <Form.Item
            name="livraison_nb_casier_75_vide"
            label={
              <span>
                <b>Livraison</b> - Nombre de casiers 12x75cl vides
              </span>
            }
          >
            <Input type="number" defaultValue={0} style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            label="Type de palette"
            name="livraison_casier_75_vide_palette_type"
          >
            <Select
              options={paletteOptions}
              style={{ width: 300 }}
              onChange={(v) => {
                if (v === null) {
                  form?.setFieldValue("livraison_casier_75_vide_nb_palette", 0);
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="livraison_casier_75_vide_nb_palette"
            label="Nombre de palettes"
            hidden={livraisonCasierPaletteType === null}
            help={
              livraisonNbCasierPalette > 0
                ? `${livraisonNbCasierPalette} palettes de ${livraisonNbCasierParPalette} casiers`
                : ""
            }
          >
            <Input
              type="number"
              defaultValue={0}
              style={{ width: 300 }}
              min={0}
            />
          </Form.Item>
        </Flex>

        <Checkbox
          checked={hasPalox}
          onChange={(e) => {
            const checked = e.target.checked;
            setHasPalox(e.target.checked);
            if (!checked) {
              resetPaloxs();
            }
          }}
        >
          Paloxs
        </Checkbox>

        <Form.Item
          name="collecte_nb_palox_plein"
          hidden={!hasPalox}
          label={
            <span>
              <b>Collecte</b> - Nombre de paloxs pleins
            </span>
          }
        >
          <Input
            type="number"
            defaultValue={0}
            style={{ width: 300 }}
            onChange={handleCollecteChange}
            min={0}
          />
        </Form.Item>
        <Form.Item
          name="livraison_nb_palox_vide"
          hidden={!hasPalox}
          label={
            <span>
              <b>Livraison</b> - Nombre de paloxs vides
            </span>
          }
        >
          <Input
            type="number"
            defaultValue={0}
            style={{ width: 300 }}
            min={0}
          />
        </Form.Item>

        <Checkbox
          checked={hasPaletteBouteilles}
          onChange={(e) => {
            const checked = e.target.checked;
            setHasPaletteBouteilles(e.target.checked);
            if (!checked) {
              resetPaletteBouteilles();
            }
          }}
        >
          Bouteilles sur palette
        </Checkbox>

        <Form.Item
          name="collecte_nb_palette_bouteille"
          hidden={!hasPaletteBouteilles}
          label={
            <span>
              <b>Collecte</b> - Nombre de palettes de bouteilles à laver
            </span>
          }
        >
          <Input
            type="number"
            defaultValue={0}
            style={{ width: 300 }}
            onChange={handleCollecteChange}
            min={0}
          />
        </Form.Item>
        <Form.Item
          name="livraison_nb_palette_bouteille"
          hidden={!hasPaletteBouteilles}
          label={
            <span>
              <b>Livraison</b> - Nombre de palettes de bouteilles propres
            </span>
          }
        >
          <Input
            type="number"
            defaultValue={0}
            style={{ width: 300 }}
            min={0}
          />
        </Form.Item>

        <Checkbox
          checked={hasFuts}
          onChange={(e) => {
            const checked = e.target.checked;
            setHasFuts(e.target.checked);
            if (checked === false) {
              resetFuts();
            }
          }}
        >
          Fûts
        </Checkbox>
        <Flex gap="middle" hidden={!hasFuts}>
          <Form.Item
            name="collecte_nb_fut_vide"
            label={
              <span>
                <b>Collecte</b> - Nombre de fûts
              </span>
            }
          >
            <Input
              type="number"
              defaultValue={0}
              style={{ width: 300 }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="Type de palette" name="collecte_fut_palette_type">
            <Select
              options={paletteOptions}
              onChange={(v) => {
                if (v === null) {
                  form?.setFieldValue("collecte_fut_nb_palette", 0);
                }
              }}
              style={{ width: "300px" }}
            />
          </Form.Item>
          <Form.Item
            name="collecte_fut_nb_palette"
            label="Nombre de palettes"
            hidden={collecteFutsPaletteType === null}
            help={
              collecteFutNbPalettes > 0
                ? `${collecteFutNbPalettes} palettes de ${collecteNbFutsParPalette} fûts`
                : ""
            }
          >
            <Input
              type="number"
              defaultValue={0}
              style={{ width: 300 }}
              min={0}
            />
          </Form.Item>
        </Flex>
        <Flex gap="middle" hidden={!hasFuts}>
          <Form.Item
            name="livraison_nb_fut_vide"
            label={
              <span>
                <b>Livraison</b> - Nombre de fûts
              </span>
            }
          >
            <Input
              type="number"
              defaultValue={0}
              style={{ width: 300 }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="Type de palette" name="livraison_fut_palette_type">
            <Select
              options={paletteOptions}
              onChange={(v) => {
                if (v === null) {
                  form?.setFieldValue("livraison_fut_nb_palette", 0);
                }
              }}
              style={{ width: "300px" }}
            />
          </Form.Item>
          <Form.Item
            name="livraison_fut_nb_palette"
            label="Nombre de palettes"
            hidden={livraisonFutsPaletteType === null}
            help={
              livraisonFutNbPalettes > 0
                ? `${livraisonFutNbPalettes} palettes de ${livraisonNbFutsParPalette} fûts`
                : ""
            }
          >
            <Input
              type="number"
              defaultValue={0}
              style={{ width: 300 }}
              min={0}
            />
          </Form.Item>
        </Flex>

        <Checkbox
          checked={hasPaletteVide}
          onChange={(e) => {
            const checked = e.target.checked;
            setHasPaletteVide(e.target.checked);
            if (checked === false) {
              resetPaletteVide();
            }
          }}
        >
          Palettes vides
        </Checkbox>

        <Flex gap="middle" hidden={!hasPaletteVide}>
          <Form.Item
            name="collecte_nb_palette_vide"
            label={
              <span>
                <b>Collecte</b> - Nombre de palettes vides
              </span>
            }
          >
            <Input
              type="number"
              defaultValue={0}
              style={{ width: 300 }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="Type de palette" name="collecte_palette_vide_type">
            <Select options={paletteOptions} style={{ width: 300 }} />
          </Form.Item>
        </Flex>

        <Flex gap="middle" hidden={!hasPaletteVide}>
          <Form.Item
            name="livraison_nb_palette_vide"
            label={
              <span>
                <b>Livraison</b> - Nombre de palettes vides
              </span>
            }
          >
            <Input
              type="number"
              defaultValue={0}
              style={{ width: 300 }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="Type de palette" name="livraison_palette_vide_type">
            <Select options={paletteOptions} style={{ width: 300 }} />
          </Form.Item>
        </Flex>

        <Form.Item
          name="collecte_nb_bouteilles"
          label={<b>TOTAL de bouteilles à collecter</b>}
          help="Calculé automatiquement mais peut-être ajusté manuellement"
          style={{ width: 300, marginTop: "1em" }}
        >
          <Input type="number" defaultValue={0} style={{ width: 300 }} />
        </Form.Item>
      </Flex>
    </Form>
  );
};
