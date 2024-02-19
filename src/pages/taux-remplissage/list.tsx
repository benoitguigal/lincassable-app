import React from "react";
import { IResourceComponentsProps, BaseRecord, useMany } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  DateField,
  TagField,
} from "@refinedev/antd";
import { Table, Space, Spin } from "antd";

export const TauxDeRemplissageList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const { data: pointDeCollecteData, isLoading: pointDeCollecteIsLoading } =
    useMany({
      resource: "point_de_collecte",
      ids: tableProps?.dataSource?.map((item) => item?.point_de_collecte) ?? [],
      queryOptions: {
        enabled: !!tableProps?.dataSource,
      },
    });

  if (pointDeCollecteIsLoading) {
    return <Spin />;
  }

  if (pointDeCollecteData) {
    return (
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="Id" />
          <Table.Column
            dataIndex={["created_at"]}
            title="Created At"
            render={(value: any) => <DateField value={value} />}
          />
          <Table.Column
            dataIndex="nombre_contenant_plein"
            title="Nombre Contenant Plein"
          />
          <Table.Column
            dataIndex={["point_de_collecte"]}
            title="Point De Collecte"
            render={(value) => {
              const pointDeCollecte = pointDeCollecteData.data.find(
                ({ id }) => id === value
              );
              if (pointDeCollecte) {
                return <TagField value={pointDeCollecte["nom"]} />;
              }
              return <div>Cannot render</div>;
            }}
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
  }

  return null;
};
