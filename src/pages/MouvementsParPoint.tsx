import { IResourceComponentsProps, useList, useOne } from "@refinedev/core";
import { Collecte, Inventaire, PointDeCollecte } from "../types";
import { Alert, Table } from "antd";
import { useParams } from "react-router-dom";

const MouvementsParPoint: React.FC<IResourceComponentsProps> = () => {
  const params = useParams();

  const pointDeCollecteId = params.id;

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
      { field: "date", operator: "gte", value: inventaire?.date },
    ],
    queryOptions: { enabled: !!pointDeCollecteId && !!inventaire },
  });

  const { data: deliveryData } = useList<Collecte>({
    resource: "collecte",
    pagination: {
      mode: "off",
    },
    sorters: [{ field: "date", order: "asc" }],
    filters: [
      {
        field: "point_de_massification_id",
        operator: "eq",
        value: pointDeCollecteId,
      },
      { field: "date", operator: "gte", value: inventaire?.date },
    ],
    queryOptions: { enabled: !!pointDeCollecteId && !!inventaire },
  });

  const pointDeCollecte = pointDeCollecteData?.data;
  const collectes = collecteData?.data ?? [];
  const deliveries = deliveryData?.data ?? [];

  const rows = [
    ...collectes.map((c) => ({ ...c, type: "collecte" })),
    ...deliveries.map((d) => ({ ...d, type: "delivery" })),
  ].sort(
    (a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
  );

  const isMassification =
    pointDeCollecte?.type === "Massification" ||
    pointDeCollecte?.type === "Tri";

  const columns = [
    { title: "Évenement", dataIndex: "event", key: "event" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Stock palox",
      dataIndex: "stock_palox",
      key: "stock_palox",
    },
    ...(isMassification
      ? [
          {
            title: "Stock palox plein",
            dataIndex: "stock_palox_plein",
            key: "stock_palox_plein",
          },
        ]
      : []),
    {
      title: "Stock casier 75cl",
      dataIndex: "stock_casier_75",
      key: "stock_casier_75",
    },
    ...(isMassification
      ? [
          {
            title: "Stock casier 75cl plein",
            dataIndex: "stock_casier_75_plein",
            key: "stock_casier_75_plein",
          },
        ]
      : []),
    {
      title: "Stock casier 33cl",
      dataIndex: "stock_casier_33",
      key: "stock_casier_33",
    },
    ...(isMassification
      ? [
          {
            title: "Stock casier 33cl plein",
            dataIndex: "stock_casier_33_plein",
            key: "stock_casier_33_plein",
          },
        ]
      : []),
  ];

  const dataSource = inventaire
    ? [
        {
          event: <a href={`/inventaire/edit/${inventaire.id}`}>Inventaire</a>,
          date: inventaire.date.slice(0, 10),
          stock_casier_75: inventaire.stock_casiers_75,
          stock_casier_75_plein: inventaire.stock_casiers_75_plein,
          stock_casier_33: inventaire.stock_casiers_33,
          stock_casier_33_plein: inventaire.stock_casiers_33_plein,
          stock_palox: inventaire.stock_paloxs,
          stock_palox_plein: inventaire.stock_paloxs_plein,
        },
        ...rows.map((row) => ({
          event: (
            <a href={`/collecte/edit/${row.id}`}>
              {row.type === "collecte" ? "Collecte" : "Livraison"}
            </a>
          ),
          date: row.date ?? "",
          stock_casier_75: (
            <div>
              {row.type === "collecte" ? "+" : "-"}
              {row.livraison_nb_casier_75_vide}
              <br />
              {row.type === "collecte" ? "-" : "+"}
              {row.collecte_nb_casier_75_plein}
            </div>
          ),
          ...(isMassification
            ? {
                stock_casier_75_plein: (
                  <div>
                    {row.type === "collecte" ? "-" : "+"}
                    {row.collecte_nb_casier_75_plein}
                  </div>
                ),
              }
            : {}),

          stock_casier_33: (
            <div>
              {row.type === "collecte" ? "+" : "-"}
              {row.livraison_nb_casier_33_vide}
              <br />
              {row.type === "collecte" ? "-" : "+"}
              {row.collecte_nb_casier_33_plein}
            </div>
          ),
          ...(isMassification
            ? {
                stock_casier_33_plein: (
                  <div>
                    {row.type === "collecte" ? "-" : "+"}
                    {row.collecte_nb_casier_33_plein}
                  </div>
                ),
              }
            : {}),
          stock_palox: (
            <div>
              {row.type === "collecte" ? "+" : "-"}
              {row.livraison_nb_palox_vide}
              <br />
              {row.type === "collecte" ? "-" : "+"}
              {row.collecte_nb_palox_plein}
            </div>
          ),
          ...(isMassification
            ? {
                stock_palox_plein: (
                  <div>
                    {row.type === "collecte" ? "-" : "+"}
                    {row.collecte_nb_palox_plein}
                  </div>
                ),
              }
            : {}),
        })),
        {
          date: <b>TOTAL</b>,
          stock_casier_75: <b>{pointDeCollecte?.stock_casiers_75}</b>,
          stock_casier_75_plein: (
            <b>{pointDeCollecte?.stock_casiers_75_plein}</b>
          ),
          stock_casier_33: <b>{pointDeCollecte?.stock_casiers_33}</b>,
          stock_casier_33_plein: (
            <b>{pointDeCollecte?.stock_casiers_33_plein}</b>
          ),
          stock_palox: <b>{pointDeCollecte?.stock_paloxs}</b>,
          stock_palox_plein: <b>{pointDeCollecte?.stock_paloxs_plein}</b>,
        },
      ]
    : [];

  return (
    <div>
      <h2>Mouvements depuis le dernier inventaire</h2>
      <h3>{pointDeCollecte?.nom}</h3>

      {!!pointDeCollecteId &&
        (inventaire ? (
          <div style={{ marginTop: "2em" }}>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
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
