import {
  ErrorComponent,
  IResourceComponentsProps,
  useCreateMany,
  useGo,
} from "@refinedev/core";
import { Button, DatePicker, Flex, Form, InputNumber } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import LincassableLogo from "../../static/images/lincassable_logo.png";
import getMonthsBetween from "../../utility/getMonthsBetween";
import dayjs from "dayjs";
import "./ConsigneCreate.css";
import { useMemo } from "react";

type FormValues = {
  consignes: {
    date: dayjs.Dayjs;
    point_de_collecte_id: number;
    consigne: number;
    deconsigne: number;
    montant: number;
  }[];
};

const ConsigneCreate: React.FC<IResourceComponentsProps> = () => {
  const { id: pointDeCollecteId } = useParams();
  const go = useGo();

  const [form] = Form.useForm<FormValues>();

  const { mutate } = useCreateMany({
    mutationOptions: {
      onSuccess: () => {
        go({
          to: `/point-de-collecte/consigne/success`,
        });
      },
    },
  });

  const [searchParams] = useSearchParams();

  function onSubmit({ consignes }: FormValues) {
    const data = consignes.map((c) => ({
      ...c,
      date: dayjs(c.date).format("YYYY-MM-DD"),
    }));
    return mutate({
      resource: "consigne",
      values: data,
    });
  }

  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const consignes = Form.useWatch("consignes", form);

  const consignesEuro = useMemo(() => {
    if (!consignes) {
      return null;
    }
    return consignes.map((c) => ({
      consigne: c.consigne * 0.5,
      deconsigne: c.deconsigne * 0.5,
    }));
  }, [consignes]);

  const fieldWidth = "210px";

  if (pointDeCollecteId && start && end) {
    const months = getMonthsBetween(start, end);

    const initialValues = {
      consignes: months.map((month) => ({
        date: month,
        point_de_collecte_id: pointDeCollecteId,
        consigne: 0,
        deconsigne: 0,
        montant: 0.5,
      })),
    };

    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          margin: 0,
          paddingTop: 60,
        }}
      >
        <div>
          <div>
            <img src={LincassableLogo} width={150}></img>
          </div>

          <h2 style={{ paddingTop: 20 }}>Formulaire consigne</h2>
          <h3>{searchParams.get("nom") ?? ""}</h3>
          <div style={{ maxWidth: 700 }}>
            Pour chaque mois, merci de préciser le nombre de bouteilles
            consignées et le nombre de bouteilles dé-consignées. <br />
            Attention à bien saisir les valeurs en{" "}
            <b>nombre de consigne (et non pas en euro).</b> <br />
            Si vous avez rejoint la filière en cours d'année, laisser à 0 pour
            les mois précédents la mise en place de la consigne dans votre point
            de vente.
          </div>
          <Form
            form={form}
            initialValues={initialValues}
            layout="vertical"
            style={{ marginTop: "2em", marginBottom: "10em" }}
            onFinish={(values) => {
              return onSubmit(values);
            }}
            autoComplete="off"
          >
            <Form.List name="consignes">
              {(fields) => (
                <Flex vertical gap={10}>
                  {fields.map((field) => {
                    const consigneEuro = consignesEuro
                      ? consignesEuro[field.key].consigne
                      : 0;
                    const deconsigneEuro = consignesEuro
                      ? consignesEuro[field.key].deconsigne
                      : 0;
                    return (
                      <Flex key={field.key} gap={20} className="consignes">
                        <Form.Item
                          name={[field.name, "date"]}
                          label="Mois"
                          getValueProps={(value) => ({
                            value: value ? dayjs(value) : undefined,
                          })}
                        >
                          <DatePicker
                            picker="month"
                            format="MMMM YYYY"
                            disabled
                            style={{ width: fieldWidth }}
                          />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, "consigne"]}
                          label={
                            <div>
                              Nombre de <b>consigne</b> encaissées
                            </div>
                          }
                          help={consigneEuro ? `Soit ${consigneEuro} €` : ""}
                        >
                          <InputNumber min={0} style={{ width: fieldWidth }} />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, "deconsigne"]}
                          label={
                            <div>
                              Nombre de <b>déconsigne</b> remboursées
                            </div>
                          }
                          help={
                            deconsigneEuro ? `Soit ${deconsigneEuro} €` : ""
                          }
                        >
                          <InputNumber min={0} style={{ width: fieldWidth }} />
                        </Form.Item>
                      </Flex>
                    );
                  })}
                </Flex>
              )}
            </Form.List>
            <Button style={{ marginTop: "1em" }} htmlType="submit" size="large">
              Envoyer
            </Button>
          </Form>
        </div>
      </div>
    );
  }

  return <ErrorComponent />;
};

export default ConsigneCreate;
