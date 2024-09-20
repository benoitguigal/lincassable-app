import { useList } from "@refinedev/core";
import { Collecte, PointDeCollecte } from "../../types";
import { useMemo } from "react";
import { DeleteButton, useTable } from "@refinedev/antd";
import { Space, Table } from "antd";
import { CollecteEditButton } from "./editButton";
import { CollecteCreateButton } from "./createButton";
import { chargementCollecte } from "../../utility/weights";

type CollecteListTableProps = {
  tournee_id: number;
  canEdit: boolean;
};

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
    {
      dataIndex: "point_de_collecte_id",
      title: "Adresse",
      render: (id: number) => {
        if (pointDeCollecteById && id) {
          return (
            <>
              <div style={{ marginBottom: "5px" }}>
                {pointDeCollecteById[id]?.adresse}
              </div>
              <div style={{ fontStyle: "italic" }}>
                {pointDeCollecteById[id]?.info}
              </div>
            </>
          );
        }
        return null;
      },
    },
    {
      dataIndex: "point_de_collecte_id",
      title: "Contact",
      render: (id: number) => {
        if (pointDeCollecteById && id) {
          return (
            <>
              <div>{pointDeCollecteById[id]?.contacts[0]}</div>
              <div>{pointDeCollecteById[id]?.telephones[0]}</div>
            </>
          );
        }
        return null;
      },
    },
    {
      title: "Casiers 12x75cl",
      children: [
        {
          dataIndex: "livraison_nb_casier_75_vide",
          title: "À livrer",
        },
        {
          dataIndex: "collecte_nb_casier_75_plein",
          title: "À collecter",
        },
      ],
    },
    {
      title: "Paloxs",
      children: [
        {
          dataIndex: "livraison_nb_palox_vide",
          title: "À livrer",
        },
        {
          dataIndex: "collecte_nb_palox_plein",
          title: "À collecter",
        },
      ],
    },
    {
      title: "Palettes bouteille",
      children: [
        {
          dataIndex: "livraison_nb_palette_bouteille",
          title: "À livrer",
        },
        {
          dataIndex: "collecte_nb_palette_bouteille",
          title: "À collecter",
        },
      ],
    },
    {
      title: "Chargement retour (hors palette)",
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
        let totalChargement = 0;

        pageData.forEach(
          ({
            livraison_nb_casier_75_vide,
            collecte_nb_casier_75_plein,
            livraison_nb_palox_vide,
            collecte_nb_palox_plein,
            livraison_nb_palette_bouteille,
            collecte_nb_palette_bouteille,
          }) => {
            totalLivraisonCasier += livraison_nb_casier_75_vide;
            totalCollecteCasier += collecte_nb_casier_75_plein;
            totalLivraisonPalox += livraison_nb_palox_vide;
            totalCollectePalox += collecte_nb_palox_plein;
            totalLivraisonPalette += livraison_nb_palette_bouteille;
            totalCollectePalette += collecte_nb_palette_bouteille;
            totalChargement += chargementCollecte({
              collecte_nb_casier_75_plein,
              collecte_nb_palox_plein,
              collecte_nb_palette_bouteille,
            });
          }
        );

        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} />
            <Table.Summary.Cell index={1} />
            <Table.Summary.Cell index={2}>
              <b>Total</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              <b>{totalLivraisonCasier}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4}>
              <b>{totalCollecteCasier}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5}>
              <b>{totalLivraisonPalox}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6}>
              <b>{totalCollectePalox}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={7}>
              <b>{totalLivraisonPalette}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={8}>
              <b>{totalCollectePalette}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={9}>
              <b>
                {totalChargement}
                {" kg"}
              </b>
            </Table.Summary.Cell>
            {canEdit && (
              <Table.Summary.Cell index={10}>
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
