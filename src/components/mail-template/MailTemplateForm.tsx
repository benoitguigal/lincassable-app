import { UseFormReturnType } from "@refinedev/antd";
import { Alert, Form, Input } from "antd";
import Editor from "react-simple-wysiwyg";
import { MailTemplate } from "../../types";
import { WarningOutlined } from "@ant-design/icons";

type Props = UseFormReturnType<MailTemplate>;

const MailTemplateForm: React.FC<Props> = ({ formProps }) => {
  return (
    <Form layout="vertical" {...formProps}>
      <Form.Item name="nom" label="Nom du gabarit" rules={[{ required: true }]}>
        <Input type="text" />
      </Form.Item>
      <Form.Item
        name="sujet"
        label="Sujet du mail"
        rules={[{ required: true }]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        name="corps"
        label="Corps du mail"
        rules={[{ required: true }]}
      >
        <Editor />
      </Form.Item>
      <Alert
        message={
          <div>
            <WarningOutlined /> Le fonctionnement des gabarits d'email présente
            quelques subtilités, assurez-vous de savoir ce que vous faites avant
            toute modification ou création <WarningOutlined />
          </div>
        }
        type="warning"
      />
    </Form>
  );
};

export default MailTemplateForm;
