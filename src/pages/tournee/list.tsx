import {
  IResourceComponentsProps,
  useGetIdentity,
  useList,
  useNavigation,
} from "@refinedev/core";
import { CreateButton, List } from "@refinedev/antd";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { Identity, TransporteurUser } from "../../types";
import { useMemo, useState } from "react";
import TourneeListTable from "../../components/tournee/list-table";
import { Segmented } from "antd";
import { CalendarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import TourneeListCalendar from "../../components/tournee/list-calendar";

dayjs.locale("fr"); // use locale globally

type View = "table" | "calendar";
const viewName = "tournee-view";

export const TourneeList: React.FC<IResourceComponentsProps> = () => {
  const { replace } = useNavigation();
  const [view, setView] = useState<View>(
    (localStorage.getItem(viewName) as View) || "table"
  );

  const handleViewChange = (value: View) => {
    // remove query params (pagination, filters, etc.) when changing view
    replace("");
    setView(value);
    localStorage.setItem(viewName, value);
  };

  const identityResponse = useGetIdentity<Identity>();

  const user = useMemo(() => identityResponse.data, [identityResponse]);

  const isTransporteur = user?.appRole === "transporteur";

  const { data: transporteurUsersData, status: transporteurUsersStatus } =
    useList<TransporteurUser>({
      resource: "transporteur_users",
      queryOptions: { enabled: isTransporteur },
    });

  const transporteur = useMemo(() => {
    if (transporteurUsersStatus === "success") {
      const transporteurIds =
        transporteurUsersData?.data.map((tu) => tu.transporteur_id) ?? [];
      if (transporteurIds.length) {
        return transporteurIds[0];
      }
    }
    return null;
  }, [transporteurUsersData, transporteurUsersStatus]);

  // const loading = useMemo(
  //   () => isTransporteur && transporteurUsersIsLoading,
  //   [isTransporteur, transporteurUsersIsLoading]
  // );

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
        // <ExportButton
        //   style={{ marginRight: "10px" }}
        //   onClick={triggerExport}
        //   loading={isLoading}
        // >
        //   Exporter
        // </ExportButton>,
        <CreateButton {...props.createButtonProps}>
          Programmer une tournée
        </CreateButton>,
      ]}
    >
      {view === "table" && user && (
        <TourneeListTable user={user} transporteur={transporteur} />
      )}
      {view === "calendar" && user && (
        <TourneeListCalendar user={user} transporteur={transporteur} />
      )}
    </List>
  );
};
