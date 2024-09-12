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
} from "@refinedev/antd";
import { Input, Select, Space, Table } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { PointDeCollecteType } from "../type";
import { pointDeCollecteTypeOptions } from "../../../utility/options";
import { PointDeCollecte, ZoneDeCollecte } from "../../../types";
import { ContenantDeCollecteType } from "../contenantDeCollecteType";

export const PointDeCollecteListTable: React.FC = () => {
  const { tableProps, filters, tableQueryResult } = useTable<PointDeCollecte>({
    syncWithLocation: true,
    pagination: { mode: "off" },
    filters: {
      mode: "server",
      initial: [
        { field: "nom", operator: "contains", value: "" },
        // { field: "type", operator: "eq", value: "" },
      ],
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

  const { data: zoneDeCollecteData } = useList<ZoneDeCollecte>({
    resource: "zone_de_collecte",
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
        title="Nom"
        sorter
        filterIcon={<SearchOutlined />}
        defaultFilteredValue={getDefaultFilter("nom", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input style={{ width: "100%" }} placeholder="Rechercher un nom" />
          </FilterDropdown>
        )}
      />
      <Table.Column<PointDeCollecte>
        dataIndex="adresse"
        title="Adresse"
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
        title="Zone de collecte"
        render={(value: number) => zoneDeCollecteById[value]?.nom ?? ""}
      />
      <Table.Column
        dataIndex="type"
        title="Type"
        sorter
        render={(type) => <PointDeCollecteType value={type} />}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              options={pointDeCollecteTypeOptions}
              style={{ width: "200px" }}
              allowClear
              mode="multiple"
              placeholder="Type de points de collecte"
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="contenant_collecte_type"
        title="Type de contenants"
        render={(type) => <ContenantDeCollecteType value={type} />}
      />
      <Table.Column dataIndex="stock_contenants" title="Stock contenants" />
      {/* <Table.Column
        dataIndex="contacts"
        title="Contact"
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
        title="E-mail"
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
      /> */}
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
