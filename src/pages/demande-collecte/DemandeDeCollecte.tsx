import React from "react";
import { IResourceComponentsProps, useCreate, useGo } from "@refinedev/core";
import { Form, Input, Button, Radio, Space, Alert } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import LincassableLogo from "../../static/images/lincassable_logo.png";
import { Title } from "@refinedev/antd";

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
  const nbCasiers33Total = Form.useWatch("nb_casiers_33_total", form);
  const nbCasiers33 = Form.useWatch("nb_casiers_33_plein", form);
  let nbCasiersTotalHelp = "";
  let nbCasiers33TotalHelp = "";

  if (!!nbCasiersTotal && !!nbCasiers) {
    if (parseInt(nbCasiersTotal) >= parseInt(nbCasiers)) {
      nbCasiersTotalHelp = `Il vous reste ${
        nbCasiersTotal - nbCasiers
      } casiers 75cl vides`;
    } else {
      nbCasiersTotalHelp = `Le stock de casiers total devrait être supérieur au nombre de casiers pleins`;
    }
  }

  if (!!nbCasiers33Total && !!nbCasiers33) {
    if (parseInt(nbCasiers33Total) >= parseInt(nbCasiers33)) {
      nbCasiers33TotalHelp = `Il vous reste ${
        nbCasiers33Total - nbCasiers33
      } casiers 33cl vides`;
    } else {
      nbCasiers33TotalHelp = `Le stock de casiers total devrait être supérieur au nombre de casiers pleins`;
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
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 60,
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
            }}
            layout="vertical"
            autoComplete="off"
            style={{ maxWidth: 500, marginTop: "2em" }}
            onFinish={(values) => {
              return onSubmit({
                point_de_collecte_id: parseInt(pointDeCollecteId),
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

            <Alert
              style={{ marginBottom: 20 }}
              type="info"
              message="Renseignez ci-dessous les taux de remplissage correspondant à vos contenants de collecte"
            ></Alert>

            <h3>Casiers 75cl</h3>
            <Form.Item
              label="Nombre de casiers 75cl pleins"
              name={"nb_casiers_plein"}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              label="Stock total de casiers 75cl (vides et pleins)"
              help={nbCasiersTotalHelp}
              name={"nb_casiers_total"}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <h3>Casiers 33cl</h3>
            <Form.Item
              label="Nombre de casiers 33cl pleins"
              name={"nb_casiers_33_plein"}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              label="Stock total de casiers 33cl (vides et pleins)"
              help={nbCasiers33TotalHelp}
              name={"nb_casiers_33_total"}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <h3>Palox</h3>
            <Form.Item
              label="Taux de remplissage palox n°1 (en %)"
              name={"remplissage_palox"}
            >
              <Input type="number" min={0} max={100} />
            </Form.Item>
            <Form.Item
              label="Taux de remplissage palox n°2 (en %)"
              name={"remplissage_palox_2"}
            >
              <Input type="number" min={0} max={100} />
            </Form.Item>

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
