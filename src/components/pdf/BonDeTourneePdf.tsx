import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import {
  Collecte,
  PointDeCollecte,
  Tournee,
  ZoneDeCollecte,
} from "../../types";
import { formatDate } from "../../utility/dateFormat";
import Decimal from "decimal.js";

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingLeft: 20,
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
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#e4e4e4",
    padding: 5,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
  },
  tableCell: {
    margin: 5,
    fontSize: 9,
  },
});

type BonDeTourneeProps = {
  tournee: Tournee;
  collectes: Collecte[];
  pointsDeCollecte: PointDeCollecte[];
  zoneDeCollecte?: ZoneDeCollecte;
};

function formatNumber(value: number) {
  if (value === 0) {
    return "";
  }
  return String(value);
}

function formatPaletteType(type: string | null) {
  if (type === null) {
    return "";
  }
  if (type === "VMF") {
    return "100x120";
  }
  return type;
}

function conditionnements(collecte: Collecte): string {
  let result = "";

  if (
    collecte.collecte_nb_casier_75_plein > 0 &&
    collecte.collecte_casier_75_plein_nb_palette > 0
  ) {
    const nbCasierParPalette = new Decimal(collecte.collecte_nb_casier_75_plein)
      .dividedBy(collecte.collecte_casier_75_plein_nb_palette)
      .toDecimalPlaces(0);
    result +=
      `[collecte] ${collecte.collecte_casier_75_plein_nb_palette} palettes ` +
      `${formatPaletteType(
        collecte.collecte_casier_75_plein_palette_type
      )} de ${nbCasierParPalette}` +
      ` casiers 75cl (${collecte.collecte_nb_casier_75_plein})\n`;
  }

  if (
    collecte.collecte_nb_casier_33_plein > 0 &&
    collecte.collecte_casier_33_plein_nb_palette > 0
  ) {
    const nbCasierParPalette = new Decimal(collecte.collecte_nb_casier_33_plein)
      .dividedBy(collecte.collecte_casier_33_plein_nb_palette)
      .toDecimalPlaces(0);
    result +=
      `[collecte] ${collecte.collecte_casier_33_plein_nb_palette} palettes ` +
      `${formatPaletteType(
        collecte.collecte_casier_33_plein_palette_type
      )} de ${nbCasierParPalette}` +
      ` casiers 33cl (${collecte.collecte_nb_casier_33_plein})\n`;
  }

  if (
    collecte.collecte_nb_fut_vide > 0 &&
    collecte.collecte_fut_nb_palette > 0
  ) {
    const nbFutsParPalette = new Decimal(collecte.collecte_nb_fut_vide)
      .dividedBy(collecte.collecte_fut_nb_palette)
      .toDecimalPlaces(0);
    result +=
      `[collecte] ${
        collecte.collecte_fut_nb_palette
      } palettes ${formatPaletteType(collecte.collecte_fut_palette_type)}` +
      ` de ${nbFutsParPalette} fûts (${collecte.collecte_nb_fut_vide})\n`;
  }

  if (collecte.collecte_nb_palette_vide > 0) {
    result +=
      `[collecte] ${collecte.collecte_nb_palette_vide}` +
      ` palettes ${formatPaletteType(
        collecte.collecte_palette_vide_type
      )} vides\n`;
  }

  if (
    collecte.livraison_nb_casier_75_vide > 0 &&
    collecte.livraison_casier_75_vide_nb_palette > 0
  ) {
    const nbCasierParPalette = new Decimal(collecte.livraison_nb_casier_75_vide)
      .dividedBy(collecte.livraison_casier_75_vide_nb_palette)
      .toDecimalPlaces(0);
    result +=
      `[livraison] ${collecte.livraison_casier_75_vide_nb_palette} palettes ` +
      `${formatPaletteType(
        collecte.livraison_casier_75_vide_palette_type
      )} de ${nbCasierParPalette}` +
      ` casiers 75cl (${collecte.livraison_nb_casier_75_vide})\n`;
  }

  if (
    collecte.livraison_nb_casier_33_vide > 0 &&
    collecte.livraison_casier_33_vide_nb_palette > 0
  ) {
    const nbCasierParPalette = new Decimal(collecte.livraison_nb_casier_33_vide)
      .dividedBy(collecte.livraison_casier_33_vide_nb_palette)
      .toDecimalPlaces(0);
    result +=
      `[livraison] ${collecte.livraison_casier_33_vide_nb_palette} palettes ` +
      `${formatPaletteType(
        collecte.livraison_casier_33_vide_palette_type
      )} de ${nbCasierParPalette}` +
      ` casiers 33cl (${collecte.livraison_nb_casier_33_vide})\n`;
  }

  if (
    collecte.livraison_nb_fut_vide > 0 &&
    collecte.livraison_fut_nb_palette > 0
  ) {
    const nbFutsParPalette = new Decimal(collecte.livraison_nb_fut_vide)
      .dividedBy(collecte.livraison_fut_nb_palette)
      .toDecimalPlaces(0);
    result +=
      `[livraison] ${
        collecte.livraison_fut_nb_palette
      } palettes ${formatPaletteType(collecte.livraison_fut_palette_type)}` +
      ` de ${nbFutsParPalette} fûts (${collecte.livraison_nb_fut_vide})\n`;
  }

  if (collecte.livraison_nb_palette_vide > 0) {
    result +=
      `[livraison] ${collecte.livraison_nb_palette_vide}` +
      ` palettes ${formatPaletteType(
        collecte.livraison_palette_vide_type
      )} vides`;
  }

  return result;
}

const BonDeTourneePdf: React.FC<BonDeTourneeProps> = ({
  tournee,
  collectes,
  pointsDeCollecte,
  zoneDeCollecte,
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
  let collecteNbCasier33Total = 0;
  let livraisonNbCasier33Total = 0;
  let collecteNbPaloxTotal = 0;
  let livraisonNbPaloxTotal = 0;
  let collecteNbPaletteTotal = 0;
  let livraisonNbPaletteTotal = 0;
  let collecteNbFutsTotal = 0;
  let livraisonNbFutsTotal = 0;

  collectes.forEach((collecte) => {
    collecteNbCasierTotal += collecte.collecte_nb_casier_75_plein;
    livraisonNbCasierTotal += collecte.livraison_nb_casier_75_vide;
    collecteNbCasier33Total += collecte.collecte_nb_casier_33_plein;
    livraisonNbCasier33Total += collecte.livraison_nb_casier_33_vide;
    collecteNbPaloxTotal += collecte.collecte_nb_palox_plein;
    livraisonNbPaloxTotal += collecte.livraison_nb_palox_vide;
    collecteNbPaletteTotal += collecte.collecte_nb_palette_bouteille;
    livraisonNbPaletteTotal += collecte.livraison_nb_palette_bouteille;
    collecteNbFutsTotal += collecte.collecte_nb_fut_vide;
    livraisonNbFutsTotal += collecte.livraison_nb_fut_vide;
  });

  const hasCasiers = collecteNbCasierTotal + livraisonNbCasierTotal > 0;
  const hasCasiers33 = collecteNbCasier33Total + livraisonNbCasier33Total > 0;
  const hasPaloxs = collecteNbPaloxTotal + livraisonNbPaloxTotal > 0;
  const hasPalettes = collecteNbPaletteTotal + livraisonNbPaletteTotal > 0;
  const hasFuts = collecteNbFutsTotal + livraisonNbFutsTotal > 0;

  const headers = [
    { cell: "", span: 2 },
    { cell: "", span: 3 },
    ...(hasCasiers ? [{ cell: "Casiers 75cl", span: 2 }] : []),
    ...(hasCasiers33 ? [{ cell: "Casiers 33cl", span: 2 }] : []),
    ...(hasPaloxs ? [{ cell: "Paloxs", span: 2 }] : []),
    ...(hasPalettes ? [{ cell: "Palettes bouteilles", span: 2 }] : []),
    ...(hasFuts ? [{ cell: "Fûts", span: 2 }] : []),
    { cell: "", span: 3 },
    { cell: "", span: 2 },
  ];

  const totalSpans = headers.map((h) => h.span).reduce((a, b) => a + b, 0);

  const width = (span: number) => {
    const fraction = ((100 / totalSpans) * span).toFixed(2);
    return `${fraction}%`;
  };

  const contenantHeaders = [
    { cell: "À collecter", span: 1 },
    { cell: "À livrer", span: 1 },
  ];

  const subHeaders = [
    { cell: "Nom / Horaires / Contact", span: 2 },
    { cell: "Adresse / Infos", span: 3 },
    ...(hasCasiers ? contenantHeaders : []),
    ...(hasCasiers33 ? contenantHeaders : []),
    ...(hasPaloxs ? contenantHeaders : []),
    ...(hasPalettes ? contenantHeaders : []),
    ...(hasFuts ? contenantHeaders : []),
    {
      cell: "Conditionnement",
      span: 3,
    },
    { cell: "Signature / tampon - Observations", span: 2 },
  ];

  const footer = [
    { cell: "", span: 2 },
    { cell: "TOTAL", span: 3 },
    ...(hasCasiers
      ? [
          { cell: collecteNbCasierTotal, span: 1 },
          { cell: livraisonNbCasierTotal, span: 1 },
        ]
      : []),
    ...(hasCasiers33
      ? [
          { cell: collecteNbCasier33Total, span: 1 },
          { cell: livraisonNbCasier33Total, span: 1 },
        ]
      : []),
    ...(hasPaloxs
      ? [
          { cell: collecteNbPaloxTotal, span: 1 },
          { cell: livraisonNbPaloxTotal, span: 1 },
        ]
      : []),
    ...(hasPalettes
      ? [
          { cell: collecteNbPaletteTotal, span: 1 },
          { cell: livraisonNbPaletteTotal, span: 1 },
        ]
      : []),
    ...(hasFuts
      ? [
          { cell: collecteNbFutsTotal, span: 1 },
          { cell: livraisonNbFutsTotal, span: 1 },
        ]
      : []),
    { cell: "", span: 3 },
    { cell: "", span: 2 },
  ];

  const rows = collectes.map((c) => {
    let nom = pointDeCollecteById[c.point_de_collecte_id]?.nom;

    if (pointDeCollecteById[c.point_de_collecte_id]?.horaires) {
      nom = `${nom} \n\n${
        pointDeCollecteById[c.point_de_collecte_id]?.horaires
      }`;
    }

    const contact = [
      pointDeCollecteById[c.point_de_collecte_id]?.contacts?.[0],
      pointDeCollecteById[c.point_de_collecte_id]?.telephones?.[0],
    ]
      .filter(Boolean)
      .join(" ");

    if (contact) {
      nom = `${nom} \n\n${contact}`;
    }

    let adresse = pointDeCollecteById[c.point_de_collecte_id]?.adresse;

    if (pointDeCollecteById[c.point_de_collecte_id]?.info) {
      adresse = `${adresse} \n\n${
        pointDeCollecteById[c.point_de_collecte_id]?.info
      }`;
    }

    return [
      { cell: nom, span: 2 },
      { cell: adresse, span: 3 },
      ...(hasCasiers
        ? [c.collecte_nb_casier_75_plein, c.livraison_nb_casier_75_vide].map(
            (cell) => ({
              cell: formatNumber(cell),
              span: 1,
            })
          )
        : []),
      ...(hasCasiers33
        ? [c.collecte_nb_casier_33_plein, c.livraison_nb_casier_33_vide].map(
            (cell) => ({
              cell: formatNumber(cell),
              span: 1,
            })
          )
        : []),
      ...(hasPaloxs
        ? [c.collecte_nb_palox_plein, c.livraison_nb_palox_vide].map(
            (cell) => ({ cell: formatNumber(cell), span: 1 })
          )
        : []),
      ...(hasPalettes
        ? [
            c.collecte_nb_palette_bouteille,
            c.livraison_nb_palette_bouteille,
          ].map((cell) => ({ cell: formatNumber(cell), span: 1 }))
        : []),
      ...(hasFuts
        ? [c.collecte_nb_fut_vide, c.livraison_nb_fut_vide].map((cell) => ({
            cell: formatNumber(cell),
            span: 1,
          }))
        : []),
      { cell: conditionnements(c), span: 3 },
      { cell: "", span: 2 },
    ];
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View>
          <Text style={{ paddingLeft: 20 }}>
            {formatDate(tournee.date)} - {zoneDeCollecte?.nom}
          </Text>
        </View>
        <View style={styles.table}>
          {/* En-tête du tableau */}
          <View style={styles.tableRow}>
            {headers.map((header) => (
              <View
                style={{ ...styles.tableColHeader, width: width(header.span) }}
              >
                <Text style={styles.tableCell}>{header.cell}</Text>
              </View>
            ))}
          </View>
          {/* Sous en-tête */}
          <View style={styles.tableRow}>
            {subHeaders.map((subHeader) => (
              <View
                style={{
                  ...styles.tableColHeader,
                  width: width(subHeader.span),
                }}
              >
                <Text style={styles.tableCell}>{subHeader.cell}</Text>
              </View>
            ))}
          </View>
          {/* Lignes du tableau */}
          {rows.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              {row.map((column) => (
                <View
                  style={{
                    ...styles.tableColHeader,
                    width: width(column.span),
                  }}
                >
                  <Text style={styles.tableCell}>{column.cell}</Text>
                </View>
              ))}
            </View>
          ))}
          {/* footer */}
          <View style={styles.tableRow}>
            {footer.map((column) => (
              <View
                style={{
                  ...styles.tableColHeader,
                  width: width(column.span),
                }}
              >
                <Text style={styles.tableCell}>{column.cell}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BonDeTourneePdf;
