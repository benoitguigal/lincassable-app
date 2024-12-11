import React, { useMemo } from "react";
import { BaseRecord, getDefaultFilter, useList } from "@refinedev/core";
import {
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  FilterDropdown,
  TextField,
  EmailField,
  useSelect,
} from "@refinedev/antd";
import { Input, Select, Space, Table } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import PointDeCollecteType from "./PointDeCollecteType";
import { pointDeCollecteTypeOptions } from "../../utility/options";
import { PointDeCollecte, ZoneDeCollecte } from "../../types";
import ContenantDeCollecteType from "../ContenantDeCollecteType";
import PointDeCollecteName from "./PointDeCollecteName";

type PointDeCollecteListTableProps = {
  // colonnes sélectionnées
  columns: string[];
};

const PointDeCollecteListTable: React.FC<PointDeCollecteListTableProps> = ({
  columns,
}) => {
  const { tableProps, filters, tableQueryResult } = useTable<PointDeCollecte>({
    syncWithLocation: true,
    pagination: { pageSize: 15, mode: "server" },
    filters: {
      mode: "server",
      initial: [{ field: "nom", operator: "contains", value: "" }],
    },
    sorters: {
      mode: "server",
      initial: [{ field: "nom", order: "asc" }],
    },
  });

  const pointsDeCollecte = useMemo(
    () => tableQueryResult?.data?.data ?? [],
    [tableQueryResult]
  );

  const { selectProps: zoneDeCollecteSelectProps } = useSelect<ZoneDeCollecte>({
    resource: "zone_de_collecte",
    optionLabel: "nom",
    optionValue: "id",
  });

  const { data: zoneDeCollecteData } = useList<ZoneDeCollecte>({
    resource: "zone_de_collecte",
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: pointsDeCollecte
          .map((pc) => pc.zone_de_collecte_id)
          .filter(Boolean),
      },
    ],
    queryOptions: { enabled: pointsDeCollecte.length > 0 },
  });

  const zoneDeCollecteById = useMemo(
    () =>
      (zoneDeCollecteData?.data ?? []).reduce<{
        [key: number]: ZoneDeCollecte;
      }>((acc, zone) => {
        return { ...acc, [zone.id]: zone };
      }, {}),
    [zoneDeCollecteData]
  );

  return (
    <Table {...tableProps} size="small" rowKey="id">
      <Table.Column
        dataIndex="nom"
        hidden={!columns.includes("nom")}
        title="Nom"
        sorter
        filterIcon={<SearchOutlined />}
        defaultFilteredValue={getDefaultFilter("nom", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input style={{ width: "100%" }} placeholder="Rechercher un nom" />
          </FilterDropdown>
        )}
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
        sorter
        render={(type) => <PointDeCollecteType value={type} />}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              options={pointDeCollecteTypeOptions}
              style={{ width: "200px" }}
              allowClear
              placeholder="Type de points de collecte"
            />
          </FilterDropdown>
        )}
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
        dataIndex="zone_de_collecte_id"
        hidden={!columns.includes("zone_de_collecte_id")}
        title="Zone de collecte"
        render={(value: number) => zoneDeCollecteById[value]?.nom ?? ""}
        sorter
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              {...zoneDeCollecteSelectProps}
              style={{ width: "200px" }}
              allowClear
              placeholder="Zone de collecte"
            />
          </FilterDropdown>
        )}
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
  );
};

export default PointDeCollecteListTable;
