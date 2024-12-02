import { PDFDownloadLink } from "@react-pdf/renderer";
import BonDeTourneePdf from "./BonDeTourneePdf";
import {
  Collecte,
  PointDeCollecte,
  Tournee,
  ZoneDeCollecte,
} from "../../types";
import { Button, Spin } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useList, useOne } from "@refinedev/core";
import { useMemo } from "react";

type BonDeTourneeDownloadLinkProps = {
  tournee?: Tournee;
};

const BonDeTourneeDownloadLink: React.FC<BonDeTourneeDownloadLinkProps> = ({
  tournee,
}) => {
  const { data: collecteData } = useList<Collecte>({
    resource: "collecte",
    pagination: { mode: "off" },
    filters: [{ field: "tournee_id", operator: "eq", value: tournee?.id }],
    queryOptions: { enabled: !!tournee },
  });

  const collectes = useMemo(() => collecteData?.data ?? [], [collecteData]);

  const { data: pointsDeCollecteData } = useList<PointDeCollecte>({
    resource: "point_de_collecte",
    filters: [
      {
        field: "id",
        operator: "in",
        value: collectes.map((c) => c.point_de_collecte_id),
      },
    ],
    queryOptions: {
      enabled: collectes && collectes.length > 0,
    },
  });

  const pointsDeCollecte = useMemo(
    () => pointsDeCollecteData?.data ?? [],
    [pointsDeCollecteData]
  );

  const { data: zoneDeCollecteData } = useOne<ZoneDeCollecte>({
    id: tournee?.zone_de_collecte_id,
    resource: "zone_de_collecte",
    queryOptions: { enabled: !!tournee && !!tournee.zone_de_collecte_id },
  });

  const zoneDeCollecte = useMemo(
    () => zoneDeCollecteData?.data,
    [zoneDeCollecteData]
  );

  if (!!tournee && collectes?.length && pointsDeCollecte?.length) {
    return (
      <PDFDownloadLink
        document={
          <BonDeTourneePdf
            tournee={tournee}
            collectes={collectes}
            pointsDeCollecte={pointsDeCollecte}
            zoneDeCollecte={zoneDeCollecte}
          />
        }
        fileName="tournee.pdf"
      >
        {({ blob, url, loading, error }) => (
          <Button
            icon={loading ? <Spin /> : <PrinterOutlined />}
            disabled={!tournee}
          >
            Bon de tournée
          </Button>
        )}
      </PDFDownloadLink>
    );
  }

  return (
    <Button icon={<PrinterOutlined />} disabled={true}>
      Bon de tournée
    </Button>
  );
};

export default BonDeTourneeDownloadLink;
