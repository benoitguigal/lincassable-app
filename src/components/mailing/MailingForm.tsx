import {
  UseFormReturnType,
  UseModalFormReturnType,
  useSelect,
} from "@refinedev/antd";
import { Mailing, MailTemplate, PointDeCollecte } from "../../types";
import { DatePicker, Form, Input, Select } from "antd";
import { useMemo } from "react";
import dayjs from "dayjs";

type Props = UseFormReturnType<Mailing> | UseModalFormReturnType<Mailing>;

type Variable = {
  name: string;
  label: string;
  type: "date" | "text" | "number";
};

const MailingForm: React.FC<Props> = ({ formProps, onFinish, form }) => {
  const { selectProps: mailTemplateSelectProps, query } =
    useSelect<MailTemplate>({
      pagination: { mode: "off" },
      resource: "mail_template",
      optionLabel: "nom",
      optionValue: "id",
    });

  const { selectProps: pointDeCollecteSelectProps } =
    useSelect<PointDeCollecte>({
      pagination: { mode: "off" },
      resource: "point_de_collecte",
      optionLabel: "nom",
      optionValue: "id",
    });

  const { selectProps: tourneeSelectProps } = useSelect<PointDeCollecte>({
    pagination: { mode: "off" },
    resource: "tournee",
    optionLabel: "id",
    optionValue: "id",
  });

  const mailTemplateId = Form.useWatch("mail_template_id", form);

  const mailtemplatesById = useMemo(
    () =>
      (query.data?.data ?? []).reduce<{
        [key: number]: MailTemplate;
      }>((acc, template) => {
        return { ...acc, [template.id]: template };
      }, {}),
    [query.data]
  );

  const mailTemplate = useMemo(
    () => mailtemplatesById[mailTemplateId],
    [mailtemplatesById, mailTemplateId]
  );

  const { variables, ...initialValues } = formProps?.initialValues ?? {};

  const variablesInitialValues = Object.keys(variables ?? {}).reduce(
    (acc, name) => {
      if (typeof variables[name] === "string") {
        // déduit si la variable est une date
        const date = dayjs(variables[name]);
        return { ...acc, [name]: date.isValid() ? date : variables[name] };
      }
      return { ...acc, [name]: variables[name] };
    },
    {}
  );

  const variableInput = (variable: Variable) => {
    if (variable.type === "date") {
      return (
        <DatePicker
          placeholder="Sélectionner une date"
          style={{ width: 300 }}
        />
      );
    }

    if (variable.name === "tournee_id") {
      return (
        <Select
          {...tourneeSelectProps}
          style={{ width: 300 }}
          placeholder="Identifiant de la tournee"
        />
      );
    }

    return <Input style={{ width: 300 }} />;
  };

  return (
    <Form
      {...formProps}
      initialValues={{ ...initialValues, ...variablesInitialValues }}
      layout="vertical"
      onFinish={(values) => {
        const { mail_template_id, point_de_collecte_ids } = values as Mailing;

        const variables = (
          (mailTemplate?.variables ?? []) as Variable[]
        ).reduce((acc, variable) => {
          const value = (values as any)[variable.name];
          return {
            ...acc,
            [variable.name]: dayjs.isDayjs(value)
              ? value.format("YYYY-MM-DD")
              : value,
          };
        }, {});

        onFinish({
          mail_template_id,
          point_de_collecte_ids,
          statut: "En attente",
          variables,
        });
      }}
      style={{ marginTop: "1em" }}
    >
      <Form.Item
        name="mail_template_id"
        label="Gabarit d'e-mail"
        rules={[{ required: true }]}
      >
        <Select
          {...mailTemplateSelectProps}
          style={{ width: 300 }}
          placeholder="Choisir un gabarit d'e-mail"
          allowClear={true}
        />
      </Form.Item>
      <Form.Item name="point_de_collecte_ids" label="Destinataires">
        <Select
          {...pointDeCollecteSelectProps}
          mode="tags"
          style={{ width: 600 }}
          placeholder="Point de collecte"
        />
      </Form.Item>
      {((mailTemplate?.variables ?? []) as Variable[]).map((variable) => (
        <Form.Item
          name={variable.name}
          label={variable.label}
          rules={[{ required: true }]}
        >
          {variableInput(variable)}
        </Form.Item>
      ))}
    </Form>
  );
};

export default MailingForm;
