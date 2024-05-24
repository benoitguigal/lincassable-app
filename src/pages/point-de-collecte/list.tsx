import React from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  getDefaultFilter,
  useSelect,
} from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  DateField,
  EmailField,
  FilterDropdown,
  TextField,
} from "@refinedev/antd";
import { Table, Space, theme, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PointDeCollecteType } from "../../components/pointsDeCollecte";
import { pointDeCollecteTypeOptions } from "../../utility/options";

export const PointDeCollecteList: React.FC<IResourceComponentsProps> = () => {
  const { token } = theme.useToken();

  const { tableProps, filters } = useTable({
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

  return (
    <List breadcrumb={false}>
      <Table {...tableProps} size="small" rowKey="id">
        <Table.Column
          dataIndex="nom"
          title="Nom"
          sorter
          filterIcon={(filtered) => (
            <SearchOutlined
            // style={{
            //   color: filtered ? token.colorPrimary : undefined,
            // }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("nom", filters, "contains")}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                style={{ width: "100%" }}
                placeholder="Rechercher un nom"
              />
            </FilterDropdown>
          )}
        />
        <Table.Column dataIndex="adresse" title="Adresse" />
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
    </List>
  );
};
