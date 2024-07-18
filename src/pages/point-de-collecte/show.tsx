import { useShow } from "@refinedev/core";
import { Show, TextField, EmailField } from "@refinedev/antd";
import { Typography } from "antd";
import { PointDeCollecte } from "../../types";
import { PointDeCollecteMap } from "../../components/pointsDeCollecte/form/map";
import { PointDeCollecteType } from "../../components/pointsDeCollecte";

const { Title } = Typography;

export const PointDeCollecteShow = () => {
  const { queryResult } = useShow<PointDeCollecte>();
  const { data, isLoading } = queryResult;

  const pointDeCollecte = data?.data;

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
    </Show>
  );
};
