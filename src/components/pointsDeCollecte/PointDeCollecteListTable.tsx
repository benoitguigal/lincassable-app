import React, { useMemo } from "react";
import { BaseOption, BaseRecord, LogicalFilter } from "@refinedev/core";
import {
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  TextField,
  EmailField,
  useSelect,
} from "@refinedev/antd";
import { Flex, Select, Space, Table } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import PointDeCollecteType from "./PointDeCollecteType";
import { pointDeCollecteTypeOptions } from "../../utility/options";
import { PointDeCollecte, ZoneDeCollecte } from "../../types";
import ContenantDeCollecteType from "../ContenantDeCollecteType";
import PointDeCollecteName from "./PointDeCollecteName";

type PointDeCollecteListTableProps = {
  // colonnes sélectionnées
  columns: string[];
};

type Record = PointDeCollecte & { zone_de_collecte?: ZoneDeCollecte };

const PointDeCollecteListTable: React.FC<PointDeCollecteListTableProps> = ({
  columns,
}) => {
  const { tableProps, setFilters, filters } = useTable<Record>({
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      initial: [{ field: "nom", order: "asc" }],
    },
    meta: { select: "*, zone_de_collecte(nom)" },
  });

  const { selectProps: zoneDeCollecteSelectProps, query: zoneDeCollecteQuery } =
    useSelect<ZoneDeCollecte>({
      resource: "zone_de_collecte",
      optionLabel: "nom",
      optionValue: "id",
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

  const zoneDeCollecteById = useMemo(
    () =>
      (zoneDeCollecteQuery.data?.data ?? []).reduce<{
        [key: number]: ZoneDeCollecte;
      }>((acc, pc) => {
        return { ...acc, [pc.id]: pc };
      }, {}),
    [zoneDeCollecteQuery]
  );

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

  const zoneDeCollecteFilter = useMemo<BaseOption | null>(() => {
    const filter = filters.find(
      (f) => (f as LogicalFilter).field === "zone_de_collecte_id"
    );
    if (filter) {
      return {
        value: filter.value,
        label: zoneDeCollecteById[filter.value]?.nom ?? "",
      };
    }
    return null;
  }, [filters, zoneDeCollecteById]);

  return (
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
        <Select
          {...zoneDeCollecteSelectProps}
          style={{ width: "200px" }}
          allowClear
          placeholder="Zone de collecte"
          value={zoneDeCollecteFilter}
          onChange={(value) => {
            if (value) {
              setFilters(
                [{ field: "zone_de_collecte_id", operator: "eq", value }],
                "merge"
              );
            } else {
              setFilters(
                filters.filter(
                  (f) => (f as LogicalFilter).field !== "zone_de_collecte_id"
                ),
                "replace"
              );
            }
          }}
        />
      </Flex>
      <Table {...tableProps} size="small" rowKey="id">
        <Table.Column
          dataIndex="nom"
          hidden={!columns.includes("nom")}
          title="Nom"
          render={(_, record: PointDeCollecte) => (
            <PointDeCollecteName pointDeCollecte={record} />
          )}
        />
        <Table.Column
          dataIndex="setup_date"
          hidden={!columns.includes("setup_date")}
          title="Date setup"
        />
        <Table.Column
          dataIndex="type"
          hidden={!columns.includes("type")}
          title="Type"
          render={(type) => <PointDeCollecteType value={type} />}
        />

        <Table.Column<PointDeCollecte>
          dataIndex="adresse"
          hidden={!columns.includes("adresse")}
          title="Adresse"
          width={350}
          render={(value, record) => (
            <div>
              {record.latitude && record.longitude && (
                <EnvironmentOutlined style={{ marginRight: "3px" }} />
              )}
              <span>{value}</span>
            </div>
          )}
        />
        <Table.Column
          dataIndex="zone_de_collecte"
          hidden={!columns.includes("zone_de_collecte_id")}
          title="Zone de collecte"
          render={(zoneDeCollecte: ZoneDeCollecte) => zoneDeCollecte?.nom}
        />

        <Table.Column
          dataIndex="contenant_collecte_type"
          hidden={!columns.includes("contenant_collecte_type")}
          title="Type de contenants"
          render={(type) => <ContenantDeCollecteType value={type} />}
        />
        <Table.Column
          dataIndex="stock_paloxs"
          hidden={!columns.includes("stock_paloxs")}
          title="Stock paloxs"
        />
        <Table.Column
          dataIndex="stock_casiers_75"
          hidden={!columns.includes("stock_casiers_75")}
          title="Stock casiers 75cl"
        />
        <Table.Column
          dataIndex="stock_casiers_33"
          hidden={!columns.includes("stock_casiers_33")}
          title="Stock casiers 33cl"
        />
        <Table.Column
          dataIndex="contacts"
          hidden={!columns.includes("contacts")}
          title="Contacts"
          render={(contacts: string[]) => (
            <div>
              {contacts.map((Contacts) => (
                <div style={{ whiteSpace: "nowrap" }}>
                  <TextField value={Contacts} />
                </div>
              ))}
            </div>
          )}
        />
        <Table.Column
          dataIndex="emails"
          hidden={!columns.includes("emails")}
          title="E-mails"
          render={(emails: string[]) => (
            <div>
              {emails.map((email) => (
                <div style={{ whiteSpace: "nowrap" }}>
                  <EmailField value={email} />
                </div>
              ))}
            </div>
          )}
        />
        <Table.Column
          dataIndex="telephones"
          hidden={!columns.includes("telephones")}
          title="N° de téléphone"
          render={(telephones: string[]) => (
            <div>
              {telephones.map((telephone) => (
                <div style={{ whiteSpace: "nowrap" }}>
                  <TextField value={telephone} />
                </div>
              ))}
            </div>
          )}
        />
        <Table.Column
          dataIndex="horaires"
          hidden={!columns.includes("horaires")}
          title="Horaires"
        />
        <Table.Column
          dataIndex="info"
          hidden={!columns.includes("info")}
          title="Informations compl."
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default PointDeCollecteListTable;
