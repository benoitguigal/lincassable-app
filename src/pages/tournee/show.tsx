import { useShow, useOne } from "@refinedev/core";
import { Show, DateField, TextField } from "@refinedev/antd";
import { Button, Segmented, Spin, Typography } from "antd";
import CollecteListTable from "../../components/collecte/listTable";
import { Tournee, Transporteur } from "../../types";
import {
  EnvironmentOutlined,
  UnorderedListOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import TourneeMap from "../../components/tournee/map";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BonDeTourneePdf from "../../components/pdf/BonDeTourneePdf";
import BonDeTourneeDownloadLink from "../../components/pdf/BonDeTourneeDownloadLink";

const { Title } = Typography;

type View = "display" | "map";

export const TourneeShow = () => {
  const { queryResult } = useShow<Tournee>();
  const { data, isLoading } = queryResult;

  const record = data?.data;

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
        <BonDeTourneeDownloadLink tournee={record} />,
        props.defaultButtons,
      ]}
    >
      {view === "display" && (
        <>
          <Title level={5}>Date</Title>
          <DateField value={record?.date} />
          <Title level={5}>Zone</Title>
          <TextField value={record?.zone} />
          <Title level={5}>Transporteur</Title>
          <TextField value={transporteurData?.data?.nom} />
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
