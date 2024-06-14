import { UseFormProps, useForm } from "@refinedev/antd";
import { IPointDeCollecte } from "../../../interfaces";
import { useEffect, useState } from "react";
import { Feature, LatLng, autocomplete } from "../../../utility/geocoding";

type Props = {
  action: UseFormProps["action"];
};

export const usePointDeCollecteForm = ({ action }: Props) => {
  const form = useForm<IPointDeCollecte>({ action });

  const setFieldValue = form.formProps.form?.setFieldValue;

  const [features, setFeatures] = useState<Feature[]>([]);

  const [latLng, setLatLng] = useState<LatLng | null>(null);

  const pointDeCollecte = form.queryResult?.data?.data;

  useEffect(() => {
    if (
      pointDeCollecte &&
      pointDeCollecte.latitude &&
      pointDeCollecte.longitude
    ) {
      setLatLng({
        lat: pointDeCollecte.latitude,
        lng: pointDeCollecte.longitude,
      });
    }
  }, [pointDeCollecte]);

  function handleAdresseSelected(adresse: string) {
    const f = features.find((f) => f.properties.formatted === adresse);
    const longitude = f?.geometry.coordinates[0];
    const latitude = f?.geometry.coordinates[1];
    if (longitude && latitude && setFieldValue) {
      setFieldValue("longitude", longitude);
      setFieldValue("latitude", latitude);
      setLatLng({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
    }
  }

  async function handleAdresseSearch(search: string) {
    if (search && search.length > 3) {
      const features = await autocomplete(search);
      setFeatures(features);
    } else {
      setFeatures([]);
    }
  }

  async function handleDragEnd(latLng: LatLng) {
    if (setFieldValue) {
      setFieldValue("longitude", latLng.lng);
      setFieldValue("latitude", latLng.lat);
      setLatLng({ lat: latLng.lat, lng: latLng.lng });
    }
  }

  return {
    ...form,
    handleAdresseSelected,
    handleAdresseSearch,
    handleDragEnd,
    latLng,
    adressOptions: features.map((f) => ({ value: f.properties.formatted })),
  };
};
