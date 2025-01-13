import { Calendar } from "antd";
import { Identity, Tournee, Transporteur, ZoneDeCollecte } from "../../types";
import { useList } from "@refinedev/core";
import { useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr"); // use locale globally

type TourneeListCalendarProps = {
  user: Identity;
};

type Record = Tournee & {
  transporteur: Transporteur;
  zone_de_collecte: ZoneDeCollecte;
};

const TourneeListCalendar: React.FC<TourneeListCalendarProps> = ({ user }) => {
  const isTransporteur = user.appRole === "transporteur";

  const { data: tourneeData } = useList<Record>({
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
    meta: {
      select: "*, transporteur(nom),zone_de_collecte(nom)",
    },
  });

  const tourneeList = useMemo(() => {
    return tourneeData?.data ?? [];
  }, [tourneeData]);

  return (
    <Calendar
      cellRender={(current) => {
        const tournee = tourneeList.find((tournee) =>
          dayjs(tournee.date).isSame(current, "day")
        );
        if (tournee) {
          return (
            <div>
              <div>{tournee.zone_de_collecte?.nom}</div>
              <div>{tournee.transporteur?.nom}</div>
            </div>
          );
        }
        return "";
      }}
    />
  );
};

export default TourneeListCalendar;
