import { useList } from "@refinedev/core";
import { Collecte, PointDeCollecte } from "../../types";
import { useMemo } from "react";
import { DeleteButton, useTable } from "@refinedev/antd";
import { Space, Table } from "antd";
import { CollecteEditButton } from "./editButton";
import { CollecteCreateButton } from "./createButton";
import { chargementCollecte } from "../../utility/weights";
import Decimal from "decimal.js";

type CollecteListTableProps = {
  tournee_id: number;
  canEdit: boolean;
};

function formatPaletteType(type: string | null) {
  if (type === null) {
    return "";
  }
  if (type === "VMF") {
    return "100x120";
  }
  return type;
}

const CollecteListTable: React.FC<CollecteListTableProps> = ({
  tournee_id,
  canEdit,
}) => {
  const { tableProps, tableQueryResult } = useTable<Collecte>({
    resource: "collecte",
    pagination: { mode: "off" },
    filters: {
      permanent: [{ field: "tournee_id", operator: "eq", value: tournee_id }],
    },
  });

  const collecteList = useMemo(
    () => tableQueryResult?.data?.data ?? [],
    [tableQueryResult]
  );

  const { data: pointsDeCollecteData, isLoading: pointDeCollecteIsLoading } =
    useList<PointDeCollecte>({
      resource: "point_de_collecte",
      pagination: { mode: "off" },
      filters: [
        {
          field: "id",
          operator: "in",
          value: collecteList.map((c) => c.point_de_collecte_id),
        },
      ],
      queryOptions: {
        enabled: collecteList && collecteList.length > 0,
      },
    });

  const pointsDeCollecteList = useMemo(
    () => pointsDeCollecteData?.data ?? [],
    [pointsDeCollecteData]
  );

  const pointDeCollecteById = useMemo(
    () =>
      pointsDeCollecteList.reduce<{
        [key: number]: PointDeCollecte;
      }>((acc, pc) => {
        return { ...acc, [pc.id]: pc };
      }, {}),
    [pointsDeCollecteList]
  );

  const loading =
    tableProps.loading ||
    (collecteList && collecteList.length > 0 && pointDeCollecteIsLoading);

  const showColumns = useMemo(() => {
    const show = {
      casier: false,
      palox: false,
      paletteBouteille: false,
      fut: false,
      paletteVide: false,
    };
    for (const collecte of collecteList) {
      if (
        collecte.collecte_nb_casier_75_plein ||
        collecte.livraison_nb_casier_75_vide
      ) {
        show.casier = true;
      }
      if (
        collecte.collecte_nb_palox_plein ||
        collecte.livraison_nb_palox_vide
      ) {
        show.palox = true;
      }
      if (
        collecte.collecte_nb_palette_bouteille ||
        collecte.livraison_nb_palette_bouteille
      ) {
        show.paletteBouteille = true;
      }
      if (collecte.collecte_nb_fut_vide || collecte.livraison_nb_fut_vide) {
        show.fut = true;
      }
      if (
        collecte.collecte_nb_palette_vide ||
        collecte.livraison_nb_palette_vide
      ) {
        show.paletteVide = true;
      }
    }
    return show;
  }, [collecteList]);

  const columns = [
    {
      dataIndex: "point_de_collecte_id",
      title: "Point de collecte",
      render: (id: number) => {
        if (pointDeCollecteById && id) {
          return (
            <>
              <div style={{ marginBottom: "5px" }}>
                {pointDeCollecteById[id]?.nom}
              </div>
              <div style={{ fontStyle: "italic" }}>
                {pointDeCollecteById[id]?.horaires}
              </div>
            </>
          );
        }
        return null;
      },
    },
    // {
    //   dataIndex: "point_de_collecte_id",
    //   title: "Adresse",
    //   render: (id: number) => {
    //     if (pointDeCollecteById && id) {
    //       return (
    //         <>
    //           <div style={{ marginBottom: "5px" }}>
    //             {pointDeCollecteById[id]?.adresse}
    //           </div>
    //           <div style={{ fontStyle: "italic" }}>
    //             {pointDeCollecteById[id]?.info}
    //           </div>
    //         </>
    //       );
    //     }
    //     return null;
    //   },
    // },
    // {
    //   dataIndex: "point_de_collecte_id",
    //   title: "Contact",
    //   render: (id: number) => {
    //     if (pointDeCollecteById && id) {
    //       return (
    //         <>
    //           <div>{pointDeCollecteById[id]?.contacts[0]}</div>
    //           <div>{pointDeCollecteById[id]?.telephones[0]}</div>
    //         </>
    //       );
    //     }
    //     return null;
    //   },
    // },
    ...(showColumns.casier
      ? [
          {
            title: "Casiers 12x75cl",
            children: [
              {
                dataIndex: "collecte_nb_casier_75_plein",
                title: "À collecter",
                render: (value: number, record: Collecte) => {
                  const nbPalettes = record.collecte_casier_75_plein_nb_palette;
                  const nbCasierParPalette = new Decimal(value)
                    .dividedBy(nbPalettes)
                    .toFixed(0);
                  const paletteType = formatPaletteType(
                    record.collecte_casier_75_plein_palette_type
                  );

                  return (
                    <>
                      <div>{value}</div>
                      {nbPalettes > 0 && (
                        <div>
                          <i>
                            {nbPalettes} palettes {paletteType} de{" "}
                            {nbCasierParPalette} casiers
                          </i>
                        </div>
                      )}
                    </>
                  );
                },
              },
              {
                dataIndex: "livraison_nb_casier_75_vide",
                title: "À livrer",
                render: (value: number, record: Collecte) => {
                  const nbPalettes = record.livraison_casier_75_vide_nb_palette;
                  const nbCasierParPalette = new Decimal(value)
                    .dividedBy(nbPalettes)
                    .toFixed(0);
                  const paletteType = formatPaletteType(
                    record.livraison_casier_75_vide_palette_type
                  );

                  return (
                    <>
                      <div>{value}</div>
                      {nbPalettes > 0 && (
                        <div>
                          <i>
                            {nbPalettes} palettes {paletteType} de{" "}
                            {nbCasierParPalette} casiers
                          </i>
                        </div>
                      )}
                    </>
                  );
                },
              },
            ],
          },
        ]
      : []),
    ...(showColumns.palox
      ? [
          {
            title: "Paloxs",
            children: [
              {
                dataIndex: "collecte_nb_palox_plein",
                title: "À collecter",
              },
              {
                dataIndex: "livraison_nb_palox_vide",
                title: "À livrer",
              },
            ],
          },
        ]
      : []),
    ...(showColumns.paletteBouteille
      ? [
          {
            title: "Palettes bouteille",
            children: [
              {
                dataIndex: "collecte_nb_palette_bouteille",
                title: "À collecter",
              },
              {
                dataIndex: "livraison_nb_palette_bouteille",
                title: "À livrer",
              },
            ],
          },
        ]
      : []),

    ...(showColumns.fut
      ? [
          {
            title: "Fûts",
            children: [
              {
                dataIndex: "collecte_nb_fut_vide",
                title: "À collecter",
                render: (value: number, record: Collecte) => {
                  const nbPalettes = record.collecte_fut_nb_palette;
                  const nbFutsParPalette = new Decimal(value)
                    .dividedBy(nbPalettes)
                    .toFixed(0);
                  const paletteType = formatPaletteType(
                    record.collecte_fut_palette_type
                  );

                  return (
                    <>
                      <div>{value}</div>
                      {nbPalettes > 0 && (
                        <div>
                          <i>
                            {nbPalettes} palettes {paletteType} de{" "}
                            {nbFutsParPalette} fûts
                          </i>
                        </div>
                      )}
                    </>
                  );
                },
              },
              {
                dataIndex: "livraison_nb_fut_vide",
                title: "À livrer",
                render: (value: number, record: Collecte) => {
                  const nbPalettes = record.livraison_fut_nb_palette;
                  const nbFutsParPalette = new Decimal(value)
                    .dividedBy(nbPalettes)
                    .toFixed(0);
                  const paletteType = formatPaletteType(
                    record.livraison_fut_palette_type
                  );

                  return (
                    <>
                      <div>{value}</div>
                      {nbPalettes > 0 && (
                        <div>
                          <i>
                            {nbPalettes} palettes {paletteType} de{" "}
                            {nbFutsParPalette} fûts
                          </i>
                        </div>
                      )}
                    </>
                  );
                },
              },
            ],
          },
        ]
      : []),
    ...(showColumns.paletteVide
      ? [
          {
            title: "Palettes vides",
            children: [
              {
                dataIndex: "collecte_nb_palette_vide",
                title: "À collecter",
                render: (value: number, record: Collecte) =>
                  `${value} ${formatPaletteType(
                    record.collecte_palette_vide_type
                  )}`,
              },
              {
                dataIndex: "livraison_nb_palette_vide",
                title: "À livrer",
                render: (value: number, record: Collecte) =>
                  `${value} ${formatPaletteType(
                    record.livraison_palette_vide_type
                  )}`,
              },
            ],
          },
        ]
      : []),
    {
      title: "Chargement retour (hors palette, hors fûts)",
      render: (_: any, record: Collecte) => chargementCollecte(record) + " kg",
    },
    ...(canEdit
      ? [
          {
            title: "Actions",
            dataIndex: "actions",
            render: (_: any, record: Collecte) => {
              return (
                <Space>
                  <CollecteEditButton collecte={record} />
                  <DeleteButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    resource="collecte"
                  />
                </Space>
              );
            },
          },
        ]
      : []),
  ];

  if (canEdit) {
    columns.push();
  }

  return (
    <Table<Collecte>
      {...tableProps}
      columns={columns}
      bordered
      loading={loading}
      rowKey="id"
      summary={(pageData) => {
        let totalLivraisonCasier = 0;
        let totalCollecteCasier = 0;
        let totalLivraisonPalox = 0;
        let totalCollectePalox = 0;
        let totalLivraisonPalette = 0;
        let totalCollectePalette = 0;
        let totalCollecteFut = 0;
        let totalLivraisonFut = 0;
        let totalCollectePaletteVide = 0;
        let totalLivraisonPaletteVide = 0;
        let totalChargement = 0;

        pageData.forEach(
          ({
            livraison_nb_casier_75_vide,
            collecte_nb_casier_75_plein,
            livraison_nb_palox_vide,
            collecte_nb_palox_plein,
            livraison_nb_palette_bouteille,
            collecte_nb_palette_bouteille,
            livraison_nb_fut_vide,
            collecte_nb_fut_vide,
            collecte_nb_palette_vide,
            livraison_nb_palette_vide,
          }) => {
            totalLivraisonCasier += livraison_nb_casier_75_vide;
            totalCollecteCasier += collecte_nb_casier_75_plein;
            totalLivraisonPalox += livraison_nb_palox_vide;
            totalCollectePalox += collecte_nb_palox_plein;
            totalLivraisonPalette += livraison_nb_palette_bouteille;
            totalCollectePalette += collecte_nb_palette_bouteille;
            totalLivraisonFut += livraison_nb_fut_vide;
            totalCollecteFut += collecte_nb_fut_vide;
            totalCollectePaletteVide += collecte_nb_palette_vide;
            totalLivraisonPaletteVide += livraison_nb_palette_vide;
            totalChargement += chargementCollecte({
              collecte_nb_casier_75_plein,
              collecte_nb_palox_plein,
              collecte_nb_palette_bouteille,
            });
          }
        );

        return (
          <Table.Summary.Row>
            {/* <Table.Summary.Cell index={0} />
            <Table.Summary.Cell index={1} /> */}
            <Table.Summary.Cell index={2}>
              <b>Total</b>
            </Table.Summary.Cell>
            {showColumns.casier && (
              <>
                <Table.Summary.Cell index={3}>
                  <b>{totalCollecteCasier}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <b>{totalLivraisonCasier}</b>
                </Table.Summary.Cell>
              </>
            )}
            {showColumns.palox && (
              <>
                <Table.Summary.Cell index={5}>
                  <b>{totalCollectePalox}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <b>{totalLivraisonPalox}</b>
                </Table.Summary.Cell>
              </>
            )}
            {showColumns.paletteBouteille && (
              <>
                <Table.Summary.Cell index={7}>
                  <b>{totalCollectePalette}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <b>{totalLivraisonPalette}</b>
                </Table.Summary.Cell>
              </>
            )}
            {showColumns.fut && (
              <>
                <Table.Summary.Cell index={9}>
                  <b>{totalCollecteFut}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10}>
                  <b>{totalLivraisonFut}</b>
                </Table.Summary.Cell>
              </>
            )}
            {showColumns.paletteVide && (
              <>
                <Table.Summary.Cell index={11}>
                  <b>{totalCollectePaletteVide}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={12}>
                  <b>{totalLivraisonPaletteVide}</b>
                </Table.Summary.Cell>
              </>
            )}
            <Table.Summary.Cell index={13}>
              <b>
                {totalChargement}
                {" kg"}
              </b>
            </Table.Summary.Cell>
            {canEdit && (
              <Table.Summary.Cell index={14}>
                <CollecteCreateButton tournee_id={tournee_id} />
              </Table.Summary.Cell>
            )}
          </Table.Summary.Row>
        );
      }}
    />
  );
};

export default CollecteListTable;
