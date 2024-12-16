import { useOne, useShow } from "@refinedev/core";
import {
  Show,
  TextField,
  EmailField,
  UrlField,
  DateField,
  NumberField,
} from "@refinedev/antd";
import { Typography } from "antd";
import { PointDeCollecte, ZoneDeCollecte } from "../../types";
import PointDeCollecteMap from "../../components/pointsDeCollecte/PointDeCollecteMap";
import LienFormulairePointDeCollecteDownloadLink from "../../components/pdf/LienFormulairePointDeCollecteDownloadLink";
import ContenantDeCollecteType from "../../components/ContenantDeCollecteType";
import {
  getPointDeCollecteConsigneFormulaireUrl,
  getPointDeCollecteFormulaireUrl,
} from "../../utility/urls";
import PointDeCollecteName from "../../components/pointsDeCollecte/PointDeCollecteName";
import PointDeCollecteType from "../../components/pointsDeCollecte/PointDeCollecteType";

const { Title } = Typography;

const PointDeCollecteShow = () => {
  const { queryResult } = useShow<PointDeCollecte>();

  const { data, isLoading } = queryResult;

  const pointDeCollecte = data?.data;

  const { data: zoneDeCollecteData } = useOne<ZoneDeCollecte>({
    resource: "zone_de_collecte",
    id: pointDeCollecte?.zone_de_collecte_id ?? "",
    queryOptions: { enabled: !!pointDeCollecte?.zone_de_collecte_id },
  });

  const pointDeCollecteFormulaireUrl = pointDeCollecte
    ? getPointDeCollecteFormulaireUrl(pointDeCollecte)
    : null;

  const pointDeCollecteConsigneFormulaire2024Url = pointDeCollecte
    ? getPointDeCollecteConsigneFormulaireUrl(
        pointDeCollecte,
        "2024-07-01",
        "2024-12-01"
      )
    : null;

  return (
    <Show isLoading={isLoading} breadcrumb={false}>
      <Title level={5}>Nom</Title>
      {pointDeCollecte && (
        <TextField
          value={<PointDeCollecteName pointDeCollecte={pointDeCollecte} />}
        />
      )}
      <Title level={5}>Date setup</Title>
      <DateField value={pointDeCollecte?.setup_date} />
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
      <Title level={5}>Horaires</Title>
      <TextField value={pointDeCollecte?.horaires} />
      <Title level={5}>Zone de collecte</Title>
      <TextField value={zoneDeCollecteData?.data?.nom} />
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
      <Title level={5}>Type de contenant de collecte</Title>
      {pointDeCollecte && pointDeCollecte.contenant_collecte_type && (
        <div>
          <ContenantDeCollecteType
            value={pointDeCollecte.contenant_collecte_type}
          />
        </div>
      )}
      <Title level={5}>Stock casiers 75cl</Title>
      <NumberField value={pointDeCollecte?.stock_casiers_75 ?? 0} />
      <Title level={5}>Stock paloxs</Title>
      <NumberField value={pointDeCollecte?.stock_paloxs ?? 0} />
      <Title level={5}>Pratique la consigne ?</Title>
      <TextField value={pointDeCollecte?.consigne ? "Oui" : "Non"} />
      <Title level={5}>Formulaire consigne 2ème semestre 2024</Title>
      {pointDeCollecte && pointDeCollecteConsigneFormulaire2024Url && (
        <UrlField value={pointDeCollecteConsigneFormulaire2024Url} />
      )}

      <Title level={5}>Informations compl.</Title>
      <TextField value={pointDeCollecte?.info} />
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

export default PointDeCollecteShow;
