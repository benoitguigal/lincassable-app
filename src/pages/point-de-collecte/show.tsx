import React from "react";
import { useShow } from "@refinedev/core";
import {
  Show,
  NumberField,
  DateField,
  TagField,
  TextField,
} from "@refinedev/antd";
import { Typography } from "antd";

const { Title } = Typography;

export const PointDeCollecteShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading} breadcrumb={false}>
      <Title level={5}>Nom</Title>
      <TextField value={record?.nom} />
      <Title level={5}>Adresse</Title>
      <TextField value={record?.adresse} />
      <Title level={5}>Type</Title>
      <TextField value={record?.type} />
      <Title level={5}>Info</Title>
      <TextField value={record?.info} />
      <Title level={5}>Emails</Title>
      <>
        {record?.emails?.map((item: any) => (
          <TagField value={item} key={item} />
        ))}
      </>
      <Title level={5}>Contacts</Title>
      {record?.contacts?.map((item: any) => (
        <TagField value={item} key={item} />
      ))}
      <Title level={5}>Telephones</Title>
      {record?.telephones?.map((item: any) => (
        <TagField value={item} key={item} />
      ))}
    </Show>
  );
};
