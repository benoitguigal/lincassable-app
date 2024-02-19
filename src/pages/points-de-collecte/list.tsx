import React from "react";
import { IResourceComponentsProps, BaseRecord } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  DateField,
  TagField,
  EmailField,
} from "@refinedev/antd";
import { Table, Space } from "antd";

export const PointDeCollecteList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        {/* <Table.Column dataIndex="id" title="Id" />
        <Table.Column
          dataIndex={["created_at"]}
          title="Created At"
          render={(value: any) => <DateField value={value} />}
        /> */}
        <Table.Column dataIndex="nom" title="Nom" />
        <Table.Column dataIndex="adresse" title="Adresse" />
        <Table.Column
          dataIndex="type"
          title="Type"
          render={(value: any) => <TagField value={value} />}
        />
        <Table.Column
          dataIndex={["setup_date"]}
          title="Setup Date"
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column dataIndex="contact" title="Contact" />
        <Table.Column
          dataIndex={["email_1"]}
          title="Email 1"
          render={(value: any) => <EmailField value={value} />}
        />
        <Table.Column dataIndex="telephone_1" title="Telephone 1" />
        <Table.Column dataIndex="horaires" title="Horaires" />
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
