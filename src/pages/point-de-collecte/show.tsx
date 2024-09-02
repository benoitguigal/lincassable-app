import { useShow } from "@refinedev/core";
import { Show, TextField, EmailField, UrlField } from "@refinedev/antd";
import { Typography } from "antd";
import { PointDeCollecte } from "../../types";
import { PointDeCollecteMap } from "../../components/pointsDeCollecte/form/map";
import { PointDeCollecteType } from "../../components/pointsDeCollecte";
import LienFormulairePointDeCollecteDownloadLink from "../../components/pdf/LienFormulairePointDeCollecteDownloadLink";

const { Title } = Typography;

const VITE_HOST = import.meta.env.VITE_HOST;

export const PointDeCollecteShow = () => {
  const { queryResult } = useShow<PointDeCollecte>();
  const { data, isLoading } = queryResult;

  const pointDeCollecte = data?.data;

  const pointDeCollecteFormulaireUrl = pointDeCollecte
    ? `${VITE_HOST}/point-de-collecte/taux-de-remplissage/${pointDeCollecte.id}?nom=${pointDeCollecte.nom}`
    : null;

  return (
    <Show isLoading={isLoading} breadcrumb={false}>
      <Title level={5}>Nom</Title>
      <TextField value={pointDeCollecte?.nom} />
      <Title level={5}>Adresse</Title>
      <TextField value={pointDeCollecte?.adresse} />
      {pointDeCollecte?.latitude && pointDeCollecte?.longitude && (
        <PointDeCollecteMap
          latLng={{
            lat: pointDeCollecte.latitude,
            lng: pointDeCollecte.longitude,
          }}
        />
      )}

      <Title level={5}>Type</Title>
      {pointDeCollecte?.type && (
        <PointDeCollecteType value={pointDeCollecte.type} />
      )}
      <Title level={5}>Contacts</Title>
      <>
        {pointDeCollecte?.contacts?.map((item: any) => (
          <div>
            <TextField value={item} key={item} />
          </div>
        ))}
      </>

      <Title level={5}>Emails</Title>
      <>
        {pointDeCollecte?.emails?.map((item: any) => (
          <div>
            <EmailField value={item} key={item} />
          </div>
        ))}
      </>
      <Title level={5}>Telephones</Title>
      {pointDeCollecte?.telephones?.map((item: any) => (
        <div>
          <TextField value={item} key={item} />
        </div>
      ))}
      <Title level={5}>Formulaire Taux de remplissage</Title>
      {pointDeCollecte && pointDeCollecteFormulaireUrl && (
        <>
          <div>
            <UrlField value={pointDeCollecteFormulaireUrl} />
          </div>
          <LienFormulairePointDeCollecteDownloadLink
            pointDeCollecte={pointDeCollecte}
            url={pointDeCollecteFormulaireUrl}
          />
        </>
      )}
    </Show>
  );
};
