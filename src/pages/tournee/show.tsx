import { useShow, useOne } from "@refinedev/core";
import { Show, DateField, TextField } from "@refinedev/antd";
import { Typography } from "antd";
import CollecteListTable from "../../components/collecte/listTable";
import { Tournee, Transporteur } from "../../types";

const { Title } = Typography;

export const TourneeShow = () => {
  const { queryResult } = useShow<Tournee>();
  const { data, isLoading } = queryResult;

  const record = data?.data;

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
    <Show isLoading={loading}>
      <Title level={5}>Date</Title>
      <DateField value={record?.date} />
      <Title level={5}>Statut</Title>
      <TextField value={record?.statut} />
      <Title level={5}>Zone</Title>
      <TextField value={record?.zone} />
      <Title level={5}>Transporteur</Title>
      <TextField value={transporteurData?.data?.nom} />
      <Title level={5}>Collectes</Title>
      {!!record && <CollecteListTable tournee_id={record.id} />}
    </Show>
  );
};
