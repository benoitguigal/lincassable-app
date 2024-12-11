import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";
import { ReactNode } from "react";

type FormListItemProps = {
  name: string;
  label: string;
  labelSingular: string;
  children: ReactNode;
};

const FormListItem: React.FC<FormListItemProps> = ({
  name,
  label,
  labelSingular,
  children,
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
                {children}
              </Form.Item>

              <MinusCircleOutlined
                className="dynamic-delete-button"
                onClick={() => remove(field.name)}
              />
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

export default FormListItem;
