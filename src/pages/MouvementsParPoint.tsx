import { useSelect } from "@refinedev/antd";
import { IResourceComponentsProps, useList, useOne } from "@refinedev/core";
import { Collecte, Inventaire, PointDeCollecte } from "../types";
import { Alert, Select, Table } from "antd";
import { useState } from "react";

const columns = [
  { title: "Évenement", dataIndex: "event", key: "event" },
  { title: "Date", dataIndex: "date", key: "date" },
  {
    title: "Stock palox",
    dataIndex: "stock_palox",
    key: "stock_palox",
  },
  {
    title: "Stock casier 75",
    dataIndex: "stock_casier_75",
    key: "stock_casier_75",
  },
  {
    title: "Stock casier 33",
    dataIndex: "stock_casier_33",
    key: "stock_casier_33",
  },
];

const MouvementsParPoint: React.FC<IResourceComponentsProps> = () => {
  const { selectProps: pointDeCollecteSelectProps } =
    useSelect<PointDeCollecte>({
      pagination: { mode: "off" },
      resource: "point_de_collecte",
      optionLabel: "nom",
      optionValue: "id",
    });

  const [pointDeCollecteId, setPointDeCollecteId] = useState<
    number | null | undefined
  >(null);

  const { data: pointDeCollecteData } = useOne<PointDeCollecte>({
    resource: "point_de_collecte",
    id: pointDeCollecteId ?? "",
    queryOptions: { enabled: !!pointDeCollecteId },
  });

  const { data: inventaireData } = useList<Inventaire>({
    resource: "inventaire",
    pagination: {
      pageSize: 1,
    },
    filters: [
      {
        field: "point_de_collecte_id",
        operator: "eq",
        value: pointDeCollecteId,
      },
    ],
    sorters: [{ field: "date", order: "desc" }],
    queryOptions: { enabled: !!pointDeCollecteId },
  });

  const inventaire = inventaireData?.data?.length
    ? inventaireData.data[0]
    : null;

  const { data: collecteData } = useList<Collecte>({
    resource: "collecte",
    pagination: {
      mode: "off",
    },
    sorters: [{ field: "date", order: "asc" }],
    filters: [
      {
        field: "point_de_collecte_id",
        operator: "eq",
        value: pointDeCollecteId,
      },
      { field: "date", operator: "gt", value: inventaire?.date },
    ],
    queryOptions: { enabled: !!pointDeCollecteId && !!inventaire },
  });

  const pointDeCollecte = pointDeCollecteData?.data;
  const collectes = collecteData?.data ?? [];

  const dataSource = inventaire
    ? [
        {
          event: <a href={`/inventaire/edit/${inventaire.id}`}>Inventaire</a>,
          date: inventaire.date.slice(0, 10),
          stock_casier_75: inventaire.stock_casiers_75,
          stock_casier_33: inventaire.stock_casiers_33,
          stock_palox: inventaire.stock_paloxs,
        },
        ...collectes.map((collecte) => ({
          event: <a href={`/collecte/edit/${collecte.id}`}>Collecte</a>,
          date: collecte.date ?? "",
          stock_casier_75: (
            <div>
              +{collecte.livraison_nb_casier_75_vide}
              <br />-{collecte.collecte_nb_casier_75_plein}
            </div>
          ),
          stock_casier_33: (
            <div>
              +{collecte.livraison_nb_casier_33_vide}
              <br />-{collecte.collecte_nb_casier_33_plein}
            </div>
          ),
          stock_palox: (
            <div>
              +{collecte.livraison_nb_palox_vide}
              <br />-{collecte.collecte_nb_palox_plein}
            </div>
          ),
        })),
        {
          date: <b>TOTAL</b>,
          stock_casier_75: <b>{pointDeCollecte?.stock_casiers_75}</b>,
          stock_casier_33: <b>{pointDeCollecte?.stock_casiers_33}</b>,
          stock_palox: <b>{pointDeCollecte?.stock_paloxs}</b>,
        },
      ]
    : [];

  return (
    <div>
      <h2>Mouvements de contenants par point depuis le dernier inventaire</h2>
      <Select
        {...pointDeCollecteSelectProps}
        onChange={(value) => {
          setPointDeCollecteId(value as any as number);
        }}
        style={{ width: "300px" }}
        allowClear={true}
        placeholder="Point de collecte / massification"
      />

      {!!pointDeCollecteId &&
        (inventaire ? (
          <div style={{ marginTop: "2em" }}>
            <Table columns={columns} dataSource={dataSource} />
          </div>
        ) : (
          <Alert
            style={{ marginTop: "2em" }}
            type="info"
            message={
              "Vous devez renseigner un premier inventaire pour ce point afin de visualiser" +
              " les mouvements de contenants."
            }
          />
        ))}
    </div>
  );
};

export default MouvementsParPoint;
