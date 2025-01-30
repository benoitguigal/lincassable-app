import { UseModalFormReturnType, useSelect } from "@refinedev/antd";
import { Mailing, MailTemplate, PointDeCollecte } from "../../types";
import { Form, Select } from "antd";

type Props = UseModalFormReturnType<Mailing>;

const MailingForm: React.FC<Props> = ({ formProps, onFinish }) => {
  const { selectProps: mailTemplateSelectProps } = useSelect<MailTemplate>({
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

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(values) => onFinish({ ...values, statut: "En attente" })}
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
    </Form>
  );
};

export default MailingForm;
