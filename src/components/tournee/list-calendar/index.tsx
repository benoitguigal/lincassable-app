import { Calendar } from "antd";
import { Identity, Tournee, Transporteur } from "../../../types";
import { useList } from "@refinedev/core";
import { useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr"); // use locale globally

type TourneeListCalendarProps = {
  user: Identity;
  transporteur: number | null;
};

const TourneeListCalendar: React.FC<TourneeListCalendarProps> = ({
  user,
  transporteur,
}) => {
  const isTransporteur = user.appRole === "transporteur";

  const { data: tourneeData } = useList<Tournee>({
    resource: "tournee",
    pagination: {
      mode: "off",
    },
    ...(isTransporteur && transporteur
      ? {
          filters: [
            { field: "transporteur_id", operator: "eq", value: transporteur },
          ],
        }
      : {}),
  });

  const tourneeList = useMemo(() => {
    return tourneeData?.data ?? [];
  }, [tourneeData]);

  const { data: transporteursData } = useList<Transporteur>({
    resource: "transporteur",
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

  return (
    <Calendar
      cellRender={(current) => {
        const tournee = tourneeList.find((tournee) =>
          dayjs(tournee.date).isSame(current, "day")
        );
        if (tournee) {
          return (
            <div>
              <div>{tournee.zone}</div>
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
