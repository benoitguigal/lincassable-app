import React from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  getDefaultFilter,
  useSelect,
  useExport,
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
  ExportButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space, theme, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PointDeCollecteType } from "../../components/pointsDeCollecte";
import { pointDeCollecteTypeOptions } from "../../utility/options";
import { title } from "process";

export const PointDeCollecteList: React.FC<IResourceComponentsProps> = () => {
  const { token } = theme.useToken();

  const { tableProps, filters, sorters } = useTable({
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

  const { isLoading, triggerExport } = useExport({
    sorters,
    filters,
    // pageSize: 50,
    // maxItemCount: 50,
    // mapData: (item) => {
    //   return {
    //     id: item.id,
    //     amount: item.amount,
    //     orderNumber: item.orderNumber,
    //     status: item.status.text,
    //     store: item.store.title,
    //     user: item.user.firstName,
    //   };
    // },
  });

  return (
    <List
      title="Points de collecte"
      canCreate={true}
      breadcrumb={false}
      headerButtons={(props) => [
        <ExportButton
          style={{ marginRight: "10px" }}
          onClick={triggerExport}
          loading={isLoading}
        >
          Exporter
        </ExportButton>,
        <CreateButton {...props.createButtonProps}>
          Ajouter un point de collecte
        </CreateButton>,
      ]}
    >
      <Table {...tableProps} size="small" rowKey="id">
        <Table.Column
          dataIndex="nom"
          title="Nom"
          sorter
          filterIcon={<SearchOutlined />}
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
