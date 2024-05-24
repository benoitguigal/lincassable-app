import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

type FormListItemProps = {
  name: string;
  label: string;
  labelSingular: string;
  placeholder: string;
};

export const FormListItem: React.FC<FormListItemProps> = ({
  name,
  label,
  labelSingular,
  placeholder,
}) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map((field, index) => (
            <Form.Item
              label={index === 0 ? label : ""}
              required={false}
              key={field.key}
            >
              <Form.Item
                {...field}
                validateTrigger={["onChange", "onBlur"]}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Merci de renseigner ou supprimer ce champ",
                  },
                ]}
                noStyle
              >
                <Input placeholder={placeholder} style={{ width: "60%" }} />
              </Form.Item>
              {fields.length > 1 ? (
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => remove(field.name)}
                />
              ) : null}
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              style={{ width: "60%" }}
              icon={<PlusOutlined />}
            >
              Ajoute un {labelSingular}
            </Button>
            {fields.length > 0 && (
              <Button
                type="dashed"
                onClick={() => {
                  add("", 0);
                }}
                style={{ width: "60%", marginTop: "20px" }}
                icon={<PlusOutlined />}
              >
                Ajoute un {labelSingular} en début de liste
              </Button>
            )}

            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
