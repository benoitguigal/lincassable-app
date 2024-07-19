import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Collecte, PointDeCollecte, Tournee, Transporteur } from "../../types";
import { useOne } from "@refinedev/core";
import { Table, TableCell, TableHeader } from "@david.kucsai/react-pdf-table";

// Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "row",
//     backgroundColor: "#E4E4E4",
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  table: {
    display: "table" as any,
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    margin: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    fontWeight: "bold",
    width: "16.6%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#e4e4e4",
    padding: 5,
  },
  tableCol: {
    width: "16.6%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
  },
  colSpan1: {
    width: "8.3%",
  },
  colSpan2: {
    width: "16.6%",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
});

type BonDeTourneeProps = {
  tournee: Tournee;
  collectes: Collecte[];
  pointsDeCollecte: PointDeCollecte[];
};

const BonDeTourneePdf: React.FC<BonDeTourneeProps> = ({
  tournee,
  collectes,
  pointsDeCollecte,
}) => {
  if (!tournee) {
    return null;
  }

  const pointDeCollecteById = pointsDeCollecte.reduce<{
    [key: number]: PointDeCollecte;
  }>((acc, pc) => {
    return { ...acc, [pc.id]: pc };
  }, {});

  let collecteNbCasierTotal = 0;
  let livraisonNbCasierTotal = 0;
  let collecteNbPaloxTotal = 0;
  let livraisonNbPaloxTotal = 0;

  collectes.forEach((collecte) => {
    collecteNbCasierTotal += collecte.collecte_nb_casier_75_plein;
    livraisonNbCasierTotal += collecte.livraison_nb_casier_75_vide;
    collecteNbPaloxTotal += collecte.collecte_nb_palox_plein;
    livraisonNbPaloxTotal += collecte.livraison_nb_palox_vide;
  });

  // Définir les données du tableau
  const tableData = [
    {
      col1: "",
      col2: "",
      col3: "Casiers",
      col4: "Paloxs",
      col5: "Palettes bouteilles",
      col6: "",
    },
    {
      col1: "Nom",
      col2: "Adresse",
      col3: "À collecter",
      col4: "À livrer",
      col5: "À collecter",
      col6: "À livrer",
      col7: "À collecter",
      col8: "À livrer",
      col9: "Signature / tampon",
    },
    ...collectes.map((c) => ({
      col1: pointDeCollecteById[c.point_de_collecte_id]?.nom,
      col2: pointDeCollecteById[c.point_de_collecte_id]?.adresse,
      col3: c.collecte_nb_casier_75_plein,
      col4: c.livraison_nb_casier_75_vide,
      col5: c.collecte_nb_palox_plein,
      col6: c.livraison_nb_palox_vide,
      col7: "",
      col8: "",
      col9: "",
    })),
    {
      col1: "",
      col2: "TOTAL",
      col3: collecteNbCasierTotal,
      col4: livraisonNbCasierTotal,
      col5: collecteNbPaloxTotal,
      col6: livraisonNbPaloxTotal,
      col7: "",
      col8: "",
      col9: "",
    },
  ];

  return (
    <Document>
      <Page
        size="A4"
        // style={styles.page}
        orientation="landscape"
      >
        <View>
          <Text>{tournee.date}</Text>
        </View>
        <View style={styles.table}>
          {/* En-tête du tableau */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
              <Text style={styles.tableCell}>{tableData[0].col1}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
              <Text style={styles.tableCell}>{tableData[0].col2}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
              <Text style={styles.tableCell}>{tableData[0].col3}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
              <Text style={styles.tableCell}>{tableData[0].col4}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
              <Text style={styles.tableCell}>{tableData[0].col5}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
              <Text style={styles.tableCell}>{tableData[0].col6}</Text>
            </View>
          </View>
          {/* Sous en-tête */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
              <Text style={styles.tableCell}>{tableData[1].col1}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
              <Text style={styles.tableCell}>{tableData[1].col2}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
              <Text style={styles.tableCell}>{tableData[1].col3}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
              <Text style={styles.tableCell}>{tableData[1].col4}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
              <Text style={styles.tableCell}>{tableData[1].col5}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
              <Text style={styles.tableCell}>{tableData[1].col6}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
              <Text style={styles.tableCell}>{tableData[1].col7}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
              <Text style={styles.tableCell}>{tableData[1].col8}</Text>
            </View>
            <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
              <Text style={styles.tableCell}>{tableData[1].col9}</Text>
            </View>
          </View>
          {/* Lignes du tableau */}
          {tableData.slice(2).map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
                <Text style={styles.tableCell}>{row.col1}</Text>
              </View>
              <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
                <Text style={styles.tableCell}>{row.col2}</Text>
              </View>
              <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
                <Text style={styles.tableCell}>{row.col3}</Text>
              </View>
              <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
                <Text style={styles.tableCell}>{row.col4}</Text>
              </View>
              <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
                <Text style={styles.tableCell}>{row.col5}</Text>
              </View>
              <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
                <Text style={styles.tableCell}>{row.col6}</Text>
              </View>
              <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
                <Text style={styles.tableCell}>{row.col7}</Text>
              </View>
              <View style={{ ...styles.tableColHeader, ...styles.colSpan1 }}>
                <Text style={styles.tableCell}>{row.col8}</Text>
              </View>
              <View style={{ ...styles.tableColHeader, ...styles.colSpan2 }}>
                <Text style={styles.tableCell}>{row.col9}</Text>
              </View>
            </View>
          ))}
        </View>
        {/* <View style={styles.section}>
          <Text>{tournee.zone}</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View> */}
      </Page>
    </Document>
  );
};

export default BonDeTourneePdf;
