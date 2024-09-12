import { useSelect } from "@refinedev/antd";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Select,
  Space,
  Tooltip,
} from "antd";
import { PointDeCollecte, ZoneDeCollecte } from "../../../types";
import { QuestionCircleOutlined } from "@ant-design/icons";

type TourneeMailFormProps = {
  form: FormInstance;
  zoneDeCollecte: ZoneDeCollecte;
};

const TourneeMailForm: React.FC<TourneeMailFormProps> = ({
  form,
  zoneDeCollecte,
}) => {
  const { selectProps: pointDeCollecteSelectProps, queryResult } =
    useSelect<PointDeCollecte>({
      resource: "point_de_collecte",
      optionLabel: "nom",
      optionValue: "id",
    });

  const pointsDeCollectes = queryResult.data?.data ?? [];

  const onPreFill = () => {
    const pointsDeCollecteInZone = pointsDeCollectes.filter(
      (pc) => pc.zone_de_collecte_id === zoneDeCollecte.id
    );
    if (pointsDeCollecteInZone.length > 0) {
      form.setFieldValue(
        "destinataires",
        pointsDeCollecteInZone.map((pc) => pc.id)
      );
    }
  };

  return (
    <>
      <Form layout="vertical" form={form}>
        <Form.Item<number[]> label="Destinataires" required={true}>
          <Space direction="horizontal">
            <Form.Item
              name="destinataires"
              noStyle
              rules={[{ required: true }]}
            >
              <Select
                style={{ width: 300 }}
                mode="multiple"
                {...pointDeCollecteSelectProps}
              />
            </Form.Item>
            <Button onClick={onPreFill}>
              Pré-remplir{" "}
              <Tooltip title="Permet de pré-remplir avec les points de collecte de la zone">
                <QuestionCircleOutlined />
              </Tooltip>
            </Button>
          </Space>
        </Form.Item>
        <Form.Item
          style={{ marginTop: 10 }}
          label="Date limite avant tournée"
          help="Date avant laquelle les destinataires doivent répondre au formulaire"
          name="dateLimit"
          rules={[{ required: true }]}
        >
          <Input type="date" style={{ width: 300 }} />
        </Form.Item>
      </Form>
    </>
  );
};

export default TourneeMailForm;
