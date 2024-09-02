import React from "react";
import { IResourceComponentsProps, useCreate } from "@refinedev/core";
import { Form, Input, Button } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import PictogrammeMagasin from "../../static/images/picto_magasin.png";
import PictogrammeBouteilleCaisse from "../../static/images/picto_bouteilles_caisses.png";
import LincassableLogo from "../../static/images/lincassable_logo.png";

const CreateRemplissageCasiers: React.FC<IResourceComponentsProps> = () => {
  const { id: pointDeCollecteId } = useParams();

  const { mutate } = useCreate();

  const [searchParams] = useSearchParams();

  type FormValues = {
    nb_casiers_plein: number;
    nb_casiers_total: number;
    point_de_collecte_id: number;
  };

  function onSubmit(values: FormValues) {
    return mutate({
      resource: "remplissage_casiers",
      values,
      successNotification: () => ({
        description: "Nombre de casiers pleins enregistré",
        message:
          "Merci d'avoir renseigné le nombre de casiers pleins, nous reviendrons vers vous rapidement",
        type: "success",
      }),
    });
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

          <div>
            <img src={PictogrammeMagasin} width={50}></img>
            <img src={PictogrammeBouteilleCaisse} width={90}></img>
          </div>

          <h2 style={{ paddingTop: 20 }}>Formulaire point de vente</h2>
          <h3>{searchParams.get("nom") ?? ""}</h3>
          <Form
            layout="vertical"
            style={{ maxWidth: 200 }}
            onFinish={(values) =>
              onSubmit({
                ...values,
                point_de_collecte_id: parseInt(pointDeCollecteId),
              })
            }
          >
            <Form.Item
              label="Nombre de casiers pleins"
              name={"nb_casiers_plein"}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Stock total de casiers (vide et plein)"
              name={"nb_casiers_total"}
            >
              <Input type="number" />
            </Form.Item>
            <Button htmlType="submit">Enregistrer</Button>
          </Form>
        </div>
      </div>
    );
  }

  return null;
};

export default CreateRemplissageCasiers;
