import React from "react";
import { IResourceComponentsProps, useCreate, useGo } from "@refinedev/core";
import { Form, Input, Button, Radio, Space } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import LincassableLogo from "../../static/images/lincassable_logo.png";

const DemandeCollecte: React.FC<IResourceComponentsProps> = () => {
  const { id: pointDeCollecteId } = useParams();

  const go = useGo();

  const [form] = Form.useForm();

  const demandeCollecte = Form.useWatch("demande_collecte", form);

  const { mutate } = useCreate({
    mutationOptions: {
      onSuccess: () => {
        go({
          to: `/point-de-collecte/taux-de-remplissage/success?demande_collecte=${demandeCollecte}`,
        });
      },
    },
  });

  const [searchParams] = useSearchParams();

  type FormValues = {
    nb_casiers_plein: number;
    nb_casiers_total: number;
    point_de_collecte_id: number;
  };

  function onSubmit(values: FormValues) {
    return mutate({
      resource: "remplissage_contenants",
      values,
    });
  }

  const nbCasiersTotal = Form.useWatch("nb_casiers_total", form);
  const nbCasiers = Form.useWatch("nb_casiers_plein", form);
  const contenantCollecte = Form.useWatch("contenant_collecte", form);
  let nbCasiersTotalHelp = "";

  if (!!nbCasiersTotal && !!nbCasiers) {
    if (parseInt(nbCasiersTotal) >= parseInt(nbCasiers)) {
      nbCasiersTotalHelp = `Il vous reste ${
        nbCasiersTotal - nbCasiers
      } casiers vides`;
    } else {
      nbCasiersTotalHelp = `Le stock de casiers total devrait être supérieur au nombre de casiers pleins`;
    }
  }

  if (pointDeCollecteId) {
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

          <h2 style={{ paddingTop: 20 }}>Formulaire magasin / producteur</h2>
          <h3>{searchParams.get("nom") ?? ""}</h3>

          <Form
            form={form}
            initialValues={{
              demande_collecte: true,
              contenant_collecte:
                searchParams.get("contenant_collecte") ?? "casier",
            }}
            layout="vertical"
            style={{ maxWidth: 500, marginTop: "2em" }}
            onFinish={({
              contenant_collecte,
              remplissage_palox,
              nb_casiers_plein,
              nb_casiers_total,
              ...values
            }) => {
              return onSubmit({
                point_de_collecte_id: parseInt(pointDeCollecteId),
                ...(contenant_collecte === "palox"
                  ? { remplissage_palox }
                  : { nb_casiers_plein, nb_casiers_total }),
                ...values,
              });
            }}
          >
            <Form.Item label="Votre demande" name="demande_collecte">
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={true}>Je souhaite être collecté.e</Radio>
                  <Radio value={false}>
                    Je souhaite simplement renseigner mon taux de remplissage
                    pour vous aider à anticiper les tournées
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Type de contenants de collecte"
              name="contenant_collecte"
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="casier_x12">Casier</Radio>
                  <Radio value="palox">Palox</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            {contenantCollecte === "palox" ? (
              <>
                <Form.Item
                  label="Taux de remplissage palox (en %)"
                  name={"remplissage_palox"}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input type="number" min={0} max={100} />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  label="Nombre de casiers pleins"
                  name={"nb_casiers_plein"}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input type="number" min={0} />
                </Form.Item>
                <Form.Item
                  label="Stock total de casiers (vides et pleins)"
                  help={nbCasiersTotalHelp}
                  name={"nb_casiers_total"}
                >
                  <Input type="number" min={0} />
                </Form.Item>
              </>
            )}

            <Button style={{ marginTop: "1em" }} htmlType="submit">
              Envoyer
            </Button>
          </Form>
        </div>
      </div>
    );
  }

  return null;
};

export default DemandeCollecte;
