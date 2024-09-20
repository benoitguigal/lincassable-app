import { Calendar } from "antd";
import {
  Identity,
  Tournee,
  Transporteur,
  ZoneDeCollecte,
} from "../../../types";
import { useList } from "@refinedev/core";
import { useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr"); // use locale globally

type TourneeListCalendarProps = {
  user: Identity;
};

const TourneeListCalendar: React.FC<TourneeListCalendarProps> = ({ user }) => {
  const isTransporteur = user.appRole === "transporteur";

  const { data: tourneeData } = useList<Tournee>({
    resource: "tournee",
    pagination: {
      mode: "off",
    },
    ...(isTransporteur
      ? {
          filters: [
            {
              field: "transporteur_id",
              operator: "eq",
              value: user.transporteurId,
            },
          ],
        }
      : {}),
  });

  const tourneeList = useMemo(() => {
    return tourneeData?.data ?? [];
  }, [tourneeData]);

  const { data: transporteursData } = useList<Transporteur>({
    resource: "transporteur",
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: [...new Set(tourneeList.map((t) => t.transporteur_id))],
      },
    ],
    queryOptions: { enabled: tourneeList?.length > 0 },
  });

  const transporteurById = useMemo(
    () =>
      (transporteursData?.data ?? []).reduce<{
        [key: number]: Transporteur;
      }>((acc, t) => {
        return { ...acc, [t.id]: t };
      }, {}),
    [transporteursData]
  );

  const { data: zoneDeCollecteData } = useList<ZoneDeCollecte>({
    resource: "zone_de_collecte",
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: tourneeList
          .map((tournee) => tournee.zone_de_collecte_id)
          .filter(Boolean),
      },
    ],
    queryOptions: { enabled: tourneeList.length > 0 },
  });

  const zoneDeCollecteById = useMemo(
    () =>
      (zoneDeCollecteData?.data ?? []).reduce<{
        [key: number]: ZoneDeCollecte;
      }>((acc, zone) => {
        return { ...acc, [zone.id]: zone };
      }, {}),
    [zoneDeCollecteData]
  );

  return (
    <Calendar
      cellRender={(current) => {
        const tournee = tourneeList.find((tournee) =>
          dayjs(tournee.date).isSame(current, "day")
        );
        if (tournee) {
          return (
            <div>
              <div>{zoneDeCollecteById[tournee.zone_de_collecte_id]?.nom}</div>
              <div>{transporteurById[tournee.transporteur_id]?.nom}</div>
            </div>
          );
        }
        return "";
      }}
    />
  );
};

export default TourneeListCalendar;
