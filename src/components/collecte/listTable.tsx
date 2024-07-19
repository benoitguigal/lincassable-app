import { useList } from "@refinedev/core";
import { Collecte, PointDeCollecte } from "../../types";
import { useMemo } from "react";
import { DeleteButton, useTable } from "@refinedev/antd";
import { Space, Table } from "antd";
import { CollecteEditButton } from "./editButton";
import { CollecteCreateButton } from "./createButton";

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

  return (
    <Table
      {...tableProps}
      bordered
      loading={loading}
      rowKey="id"
      summary={(pageData) => {
        let totalLivraisonCasier = 0;
        let totalCollecteCasier = 0;
        let totalLivraisonPalox = 0;
        let totalCollectePalox = 0;

        pageData.forEach(
          ({
            livraison_nb_casier_75_vide,
            collecte_nb_casier_75_plein,
            livraison_nb_palox_vide,
            collecte_nb_palox_plein,
          }) => {
            totalLivraisonCasier += livraison_nb_casier_75_vide;
            totalCollecteCasier += collecte_nb_casier_75_plein;
            totalLivraisonPalox += livraison_nb_palox_vide;
            totalCollectePalox += collecte_nb_palox_plein;
          }
        );

        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>
              <b>Total</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <b>{totalLivraisonCasier}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <b>{totalCollecteCasier}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              <b>{totalLivraisonPalox}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4}>
              <b>{totalCollectePalox}</b>
            </Table.Summary.Cell>
            {canEdit && (
              <Table.Summary.Cell index={5}>
                <CollecteCreateButton tournee_id={tournee_id} />
              </Table.Summary.Cell>
            )}
          </Table.Summary.Row>
        );
      }}
    >
      <Table.Column
        dataIndex="point_de_collecte_id"
        title="Point de collecte"
        render={(id: number) => {
          if (pointDeCollecteById && id) {
            return pointDeCollecteById[id]?.nom;
          }
          return null;
        }}
      />
      <Table.Column
        dataIndex="livraison_nb_casier_75_vide"
        title="Nbre de casiers 12x75 vides à livrer"
      />
      <Table.Column
        dataIndex="collecte_nb_casier_75_plein"
        title="Nbre de casiers 12x75 pleins à collecter"
      />
      <Table.Column
        dataIndex="livraison_nb_palox_vide"
        title="Nbre de paloxs vides à livrer"
      />
      <Table.Column
        dataIndex="collecte_nb_palox_plein"
        title="Nbre de paloxs pleins à collecter"
      />
      {canEdit && (
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: Collecte) => (
            <Space>
              <CollecteEditButton collecte={record} />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                resource="collecte"
              />
            </Space>
          )}
        />
      )}
    </Table>
  );
};

export default CollecteListTable;
