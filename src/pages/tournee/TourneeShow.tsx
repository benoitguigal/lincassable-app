import { useShow, useOne } from "@refinedev/core";
import { Show, DateField, TextField, NumberField } from "@refinedev/antd";
import { Segmented, Typography } from "antd";
import CollecteListTable from "../../components/collecte/CollecteListTable";
import { Collecte, Tournee, Transporteur, ZoneDeCollecte } from "../../types";
import { EnvironmentOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useState } from "react";
import TourneeMap from "../../components/tournee/TourneeMap";
import BonDeTourneeDownloadLink from "../../components/pdf/BonDeTourneeDownloadLink";
import TourneeStatutTag from "../../components/tournee/TourneeStatutTag";
import BonDeTourneeUpload from "../../components/tournee/BonDeTourneeUpload";
import { typeDeVehiculeOptions } from "../../utility/options";
import TourneeMailButton from "../../components/tournee/TourneeMailButton";

const { Title } = Typography;

type View = "display" | "map";

const TourneeShow = () => {
  const { query } = useShow<Tournee & { collecte: Collecte[] }>({
    meta: { select: "*,collecte(*)" },
  });

  const { data, isLoading } = query;

  const record = data?.data;

  const { data: zoneDeCollecteData } = useOne<ZoneDeCollecte>({
    resource: "zone_de_collecte",
    id: record?.zone_de_collecte_id ?? "",
    queryOptions: { enabled: !!record?.zone_de_collecte_id },
  });

  const viewName = `tournee-show-${record?.id}`;

  const [view, setView] = useState<View>(
    (localStorage.getItem(viewName) as View) || "display"
  );

  const handleViewChange = (value: View) => {
    setView(value);
    localStorage.setItem(viewName, value);
  };

  const { data: transporteurData, isLoading: transporteurIsLoading } =
    useOne<Transporteur>({
      resource: "transporteur",
      id: record?.transporteur_id || "",
      queryOptions: {
        enabled: !!record,
      },
    });

  const loading = isLoading && transporteurIsLoading;

  return (
    <Show
      isLoading={loading}
      breadcrumb={false}
      headerButtons={(props) => [
        <Segmented<View>
          key="view"
          size="large"
          value={view}
          style={{ marginRight: 24 }}
          options={[
            {
              label: "",
              value: "display",
              icon: <UnorderedListOutlined />,
            },
            {
              label: "",
              value: "map",
              icon: <EnvironmentOutlined />,
            },
          ]}
          onChange={handleViewChange}
        />,
        <TourneeMailButton tournee={record} />,
        <BonDeTourneeDownloadLink tournee={record} />,
        props.defaultButtons,
      ]}
    >
      {view === "display" && (
        <>
          <Title level={5}>Date</Title>
          <DateField value={record?.date} />
          <Title level={5}>Zone de collecte</Title>
          <TextField value={zoneDeCollecteData?.data?.nom} />
          <Title level={5}>Statut</Title>
          {record && <TourneeStatutTag value={record.statut} />}
          <Title level={5}>Transporteur</Title>
          <TextField value={transporteurData?.data?.nom} />
          <Title level={5}>Type de véhicule</Title>
          {record?.type_de_vehicule && (
            <TextField
              value={
                typeDeVehiculeOptions.find(
                  (option) => option.value === record.type_de_vehicule
                )?.label ?? ""
              }
            />
          )}
          <Title level={5}>Prix</Title>
          {record?.prix && <NumberField value={record.prix} />}
          {record && zoneDeCollecteData?.data && (
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              <Title level={5}>Bon de tournée complété</Title>
              <BonDeTourneeUpload
                tournee={record}
                zoneDeCollecte={zoneDeCollecteData?.data}
              />
            </div>
          )}

          <Title level={5}>Collectes</Title>
          {!!record && (
            <CollecteListTable tournee_id={record.id} canEdit={false} />
          )}
        </>
      )}
      {view === "map" && !!record && <TourneeMap {...record} />}
    </Show>
  );
};

export default TourneeShow;
