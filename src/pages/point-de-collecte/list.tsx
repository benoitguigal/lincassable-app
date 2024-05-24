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
} from "@refinedev/antd";
import { Table, Space, theme, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PointDeCollecteType } from "../../components/pointsDeCollecte";

export const PointDeCollecteList: React.FC<IResourceComponentsProps> = () => {
  const { token } = theme.useToken();

  const { tableProps, filters } = useTable({
    syncWithLocation: true,
    pagination: { mode: "off" },
    filters: {
      mode: "server",
      initial: [{ field: "nom", operator: "contains", value: "" }],
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
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
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
                options={[
                  { value: "Magasin", label: "Magasin" },
                  { value: "Producteur", label: "Producteur" },
                ]}
                style={{ width: "200px" }}
                allowClear
                mode="multiple"
                placeholder="Type de points de collecte"
              />
            </FilterDropdown>
          )}
        />
        <Table.Column dataIndex="contact" title="Contact" />
        <Table.Column
          dataIndex="email_1"
          title="Email 1"
          render={(value: string) => <EmailField value={value} />}
        />
        <Table.Column
          dataIndex="email_2"
          title="Email 2"
          render={(value: string) => <EmailField value={value} />}
        />
        <Table.Column
          dataIndex="email_3"
          title="Email 3"
          render={(value: string) => <EmailField value={value} />}
        />
        <Table.Column dataIndex="telephone_1" title="Telephone 1" />
        {/* <Table.Column
          dataIndex="id"
          title="Formulaire taux de remplissage"
          render={(value: any) => (
            <Link to={`/point-de-collecte/taux-de-remplissage/${value}`}>
              Lien
            </Link>
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
    </List>
  );
};
