import React, { useMemo } from "react";
import {
  BaseOption,
  IResourceComponentsProps,
  LogicalFilter,
  useExport,
  useGo,
} from "@refinedev/core";
import { List, ExportButton, useTable, useSelect } from "@refinedev/antd";
import { Button, Flex, Select, Space, Table } from "antd";
import { Inventaire, PointDeCollecte } from "../../types";
import { pointDeCollecteTypeOptions } from "../../utility/options";
import { EyeOutlined } from "@ant-design/icons";
import { RefineButtonClassNames } from "@refinedev/ui-types";
import { Link } from "react-router-dom";

function getLatestInventaire(inventaires: Inventaire[]) {
  const latestInventaire = inventaires.reduce((latest, current) => {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  }, inventaires[0]);
  return latestInventaire
    ? new Date(latestInventaire.date).toLocaleDateString()
    : "";
}

type Record = PointDeCollecte & { inventaire: Inventaire[] };

const ContenantList: React.FC<IResourceComponentsProps> = () => {
  const go = useGo();

  const { tableProps, setFilters, filters } = useTable<Record>({
    resource: "point_de_collecte",
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      initial: [{ field: "nom", order: "asc" }],
    },
    meta: { select: "*,inventaire(*)" },
  });

  const {
    selectProps: pointDeCollecteSelectProps,
    query: pointDeCollecteQuery,
  } = useSelect<PointDeCollecte>({
    resource: "point_de_collecte",
    pagination: { mode: "off" },
    optionLabel: "nom",
    optionValue: "id",
  });

  const { isLoading, triggerExport } = useExport<Record>({
    resource: "point_de_collecte",
    mapData: (pointDeCollecte) => ({
      Nom: pointDeCollecte.nom,
      "Date du dernier inventaire": getLatestInventaire(
        pointDeCollecte.inventaire
      ),
      "Stock casiers 75cl": pointDeCollecte.stock_casiers_75,
      "Stock casiers 75cl plein": pointDeCollecte.stock_casiers_75_plein,
      "Stock casiers 33cl": pointDeCollecte.stock_casiers_33,
      "Stock casiers 33cl plein": pointDeCollecte.stock_casiers_33_plein,
      "Stock palox": pointDeCollecte.stock_paloxs,
      "Stock palox plein": pointDeCollecte.stock_paloxs_plein,
    }),
    meta: { select: "*,inventaire(*)" },
  });

  const pointDeCollecteById = useMemo(
    () =>
      (pointDeCollecteQuery.data?.data ?? []).reduce<{
        [key: number]: PointDeCollecte;
      }>((acc, pc) => {
        return { ...acc, [pc.id]: pc };
      }, {}),
    [pointDeCollecteQuery]
  );

  const pointDeCollecteTypeByValue = pointDeCollecteTypeOptions.reduce<{
    [key: string]: string;
  }>((acc, curr) => {
    return { ...acc, [curr.value]: curr.label };
  }, {});

  const pointDeCollecteFilter = useMemo<BaseOption | null>(() => {
    const filter = filters.find((f) => (f as LogicalFilter).field === "id");
    if (filter) {
      return {
        value: filter.value,
        label: pointDeCollecteById[filter.value]?.nom ?? "",
      };
    }
    return null;
  }, [filters, pointDeCollecteById]);

  const pointDeCollecteTypeFilter = useMemo<BaseOption | null>(() => {
    const filter = filters.find((f) => (f as LogicalFilter).field === "type");
    if (filter) {
      return {
        value: filter.value,
        label: pointDeCollecteTypeByValue[filter.value] ?? "",
      };
    }
    return null;
  }, [filters, pointDeCollecteTypeByValue]);

  return (
    <List
      title="Stock de contenants de collecte par point"
      canCreate={false}
      breadcrumb={false}
      headerButtons={() => [
        <ExportButton
          style={{ marginRight: "10px" }}
          onClick={triggerExport}
          loading={isLoading}
        >
          Exporter
        </ExportButton>,
      ]}
    >
      <>
        <Flex gap="middle" style={{ marginBottom: "20px" }}>
          <Select
            {...pointDeCollecteSelectProps}
            style={{ width: "250px" }}
            allowClear
            placeholder="Point de collecte"
            value={pointDeCollecteFilter}
            onChange={(value) => {
              if (value) {
                setFilters([{ field: "id", operator: "eq", value }], "merge");
              } else {
                setFilters(
                  filters.filter((f) => (f as LogicalFilter).field !== "id"),
                  "replace"
                );
              }
            }}
          />
          <Select
            options={pointDeCollecteTypeOptions}
            style={{ width: "200px" }}
            allowClear
            placeholder="Type de point de collecte"
            value={pointDeCollecteTypeFilter}
            onChange={(value) => {
              if (value) {
                setFilters([{ field: "type", operator: "eq", value }], "merge");
              } else {
                setFilters(
                  filters.filter((f) => (f as LogicalFilter).field !== "type"),
                  "replace"
                );
              }
            }}
          />
        </Flex>
        <Table {...tableProps} size="small" rowKey="id">
          <Table.Column
            dataIndex="nom"
            title="Nom"
            render={(_, pointDeCollecte: Record) => {
              if (pointDeCollecte) {
                return (
                  <Link to={`/point-de-collecte/edit/${pointDeCollecte.id}`}>
                    {pointDeCollecte.nom}
                  </Link>
                );
              }
              return "";
            }}
          />
          <Table.Column
            dataIndex="inventaire"
            title="Date du dernier inventaire"
            render={(value: Inventaire[]) => getLatestInventaire(value)}
          />
          <Table.Column dataIndex="stock_paloxs" title="Palox" />
          <Table.Column dataIndex="stock_paloxs_plein" title="Palox plein" />
          <Table.Column dataIndex="stock_casiers_75" title="Casiers 75cl" />
          <Table.Column
            dataIndex="stock_casiers_75_tampon"
            title="Casiers 75cl tampon"
          />
          <Table.Column
            dataIndex="stock_casiers_75_plein"
            title="Casiers 75cl plein"
          />
          <Table.Column dataIndex="stock_casiers_33" title="Casiers 33cl" />
          <Table.Column
            dataIndex="stock_casiers_33_plein"
            title="Casiers 33cl plein"
          />
          <Table.Column
            dataIndex="stock_casiers_33_tampon"
            title="Casiers 33cl tampon"
          />

          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_, record: Record) => (
              <Space>
                <Button
                  size="small"
                  hidden={getLatestInventaire(record.inventaire) === ""}
                  icon={<EyeOutlined />}
                  className={RefineButtonClassNames.ShowButton}
                  onClick={() => go({ to: `/mouvement/${record.id}` })}
                ></Button>
              </Space>
            )}
          />
        </Table>
      </>
    </List>
  );
};

export default ContenantList;
