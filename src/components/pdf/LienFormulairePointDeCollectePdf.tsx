import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { PointDeCollecte } from "../../types";

type LienFormulairePointDeCollecteProps = {
  pointDeCollecte: PointDeCollecte;
  qrCode?: string | null;
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: { marginBottom: 20 },
  desription: { fontSize: "15", marginBottom: 10 },
});

const LienFormulairePointDeCollectePdf: React.FC<
  LienFormulairePointDeCollecteProps
> = ({ pointDeCollecte, qrCode }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="portrait">
        <View>
          <Text style={styles.title}>{pointDeCollecte.nom}</Text>
          <Text style={styles.desription}>
            Lien du formulaire permettant de renseigner le taux de remplissage
            des contenants de collecte :
          </Text>
          {qrCode && <Image src={qrCode} style={{ width: 100, height: 100 }} />}
        </View>
      </Page>
    </Document>
  );
};

export default LienFormulairePointDeCollectePdf;
