import {
  IResourceComponentsProps,
  useExport,
  useGetIdentity,
  useNavigation,
} from "@refinedev/core";
import { CreateButton, ExportButton, List } from "@refinedev/antd";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {
  Collecte,
  Identity,
  PointDeCollecte,
  Tournee,
  Transporteur,
  ZoneDeCollecte,
} from "../../types";
import { useMemo, useState } from "react";
import TourneeListTable from "../../components/tournee/TourneeListTable";
import { Segmented } from "antd";
import { CalendarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import TourneeListCalendar from "../../components/tournee/TourneeListCalendar";

dayjs.locale("fr"); // use locale globally

type View = "table" | "calendar";
const viewName = "tournee-view";

type Record = Tournee & {
  collecte: (Collecte & { point_de_collecte: PointDeCollecte })[];
  transporteur: Transporteur;
  zone_de_collecte: ZoneDeCollecte;
};

const TourneeList: React.FC<IResourceComponentsProps> = () => {
  const [view, setView] = useState<View>(
    (localStorage.getItem(viewName) as View) || "table"
  );

  const handleViewChange = (value: View) => {
    setView(value);
    localStorage.setItem(viewName, value);
  };

  const identityResponse = useGetIdentity<Identity>();

  const user = useMemo(() => identityResponse.data, [identityResponse]);

  const { isLoading, triggerExport } = useExport<Record>({
    mapData: (tournee) => {
      return {
        date: tournee.date,
        "Zone de collecte": tournee.zone_de_collecte?.nom,
        Statut: tournee.statut,
        Transporteur: tournee.transporteur?.nom,
        Collectes: tournee.collecte
          .map((c) => c.point_de_collecte?.nom)
          .join(", "),
        "Type de véhicule": tournee.type_de_vehicule,
        Prix: tournee.prix,
      };
    },
    meta: {
      select:
        "*, collecte(*,point_de_collecte(nom)),transporteur(nom),zone_de_collecte(nom)",
    },
  });

  return (
    <List
      title="Tournées"
      canCreate={true}
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
              value: "table",
              icon: <UnorderedListOutlined />,
            },
            {
              label: "",
              value: "calendar",
              icon: <CalendarOutlined />,
            },
          ]}
          onChange={handleViewChange}
        />,
        <ExportButton
          style={{ marginRight: "10px" }}
          onClick={triggerExport}
          loading={isLoading}
        >
          Exporter
        </ExportButton>,
        <CreateButton {...props.createButtonProps}>
          Programmer une tournée
        </CreateButton>,
      ]}
    >
      {view === "table" && user && <TourneeListTable user={user} />}
      {view === "calendar" && user && <TourneeListCalendar user={user} />}
    </List>
  );
};

export default TourneeList;
