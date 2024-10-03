import { PDFDownloadLink } from "@react-pdf/renderer";
import LienFormulairePointDeCollectePdf from "./LienFormulairePointDeCollectePdf";
import { PointDeCollecte } from "../../types";
import { Button, Spin } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";
import * as QRCode from "qrcode";
import { useEffect, useState } from "react";

type LienFormulairePointDeCollecteDownloadLinkProps = {
  pointDeCollecte: PointDeCollecte;
  url: string | null;
};

const LienFormulairePointDeCollecteDownloadLink: React.FC<
  LienFormulairePointDeCollecteDownloadLinkProps
> = ({ pointDeCollecte, url }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    async function getQrCode(url: string) {
      const generated = await QRCode.toDataURL(url);
      setQrCode(generated);
    }
    if (!qrCode && url) {
      getQrCode(url);
    }
  }, [url, qrCode]);

  return (
    <PDFDownloadLink
      document={
        <LienFormulairePointDeCollectePdf
          pointDeCollecte={pointDeCollecte}
          qrCode={qrCode}
        />
      }
      fileName="qr-code.pdf"
    >
      {({ blob, loading, error }) => (
        <Button icon={loading ? <Spin /> : <QrcodeOutlined />}>
          Télécharger le QR code
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default LienFormulairePointDeCollecteDownloadLink;
