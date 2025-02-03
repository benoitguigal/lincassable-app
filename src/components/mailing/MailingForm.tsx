import { UseFormReturnType, useSelect } from "@refinedev/antd";
import { Mailing, MailTemplate, PointDeCollecte } from "../../types";
import { DatePicker, Form, Input, Select } from "antd";
import { useMemo } from "react";
import dayjs from "dayjs";

type Props = UseFormReturnType<Mailing>;

type Variable = { name: string; label: string; type: "date" | "text" };

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

  return (
    <Form
      {...formProps}
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
      {((mailTemplate?.variables ?? []) as Variable[]).map(
        ({ name, label, type }) => (
          <Form.Item name={name} label={label} rules={[{ required: true }]}>
            {type === "date" ? (
              <DatePicker
                {...(formProps?.initialValues?.variables?.[name]
                  ? {
                      defaultValue: dayjs(
                        formProps?.initialValues?.variables?.[name]
                      ),
                    }
                  : {})}
                placeholder="Sélectionner une date"
                style={{ width: 300 }}
              />
            ) : (
              <Input style={{ width: 300 }} />
            )}
          </Form.Item>
        )
      )}
    </Form>
  );
};

export default MailingForm;
