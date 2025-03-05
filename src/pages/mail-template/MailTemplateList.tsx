import { EditButton, List, useTable } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Space, Table } from "antd";
import { MailTemplate } from "../../types";

const MailTemplateList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable<MailTemplate>({
    syncWithLocation: true,
    pagination: { pageSize: 20, mode: "server" },
    sorters: {
      mode: "server",
      permanent: [{ field: "nom", order: "asc" }],
    },
  });

  return (
    <List breadcrumb={false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="nom" title="Nom du gabarit" />

        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: MailTemplate) => {
            return (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};

export default MailTemplateList;
