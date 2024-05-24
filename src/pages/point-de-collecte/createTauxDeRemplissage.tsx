import React from "react";
import { IResourceComponentsProps, useCreate, useOne } from "@refinedev/core";
import { Form, Input, Button, Flex } from "antd";
import { useParams } from "react-router-dom";
import PictogrammeMagasin from "../../static/images/picto_magasin.png";
import PictogrammeBouteilleCaisse from "../../static/images/picto_bouteilles_caisses.png";
import LincassableLogo from "../../static/images/lincassable_logo.png";

export const CreateTauxDeRemplissage: React.FC<
  IResourceComponentsProps
> = () => {
  // const { formProps, saveButtonProps, queryResult } = useForm({
  //   action: "create",
  //   resource: "taux_de_remplissage",
  //   redirect: false,
  //   successNotification: (data, values, resource) => {
  //     return {
  //       description: "Nombre de casiers plein enregistré",
  //       message: "Le nombre de casiers pleins a bien été pris en compte",
  //       type: "success",
  //     };
  //   },
  // });

  const { id: parmamId } = useParams();

  const id = parmamId ?? "1";

  const { data: pointDeCollecteData, error: pointDeCollecteError } = useOne({
    resource: "point_de_collecte",
    id,
  });

  const { mutate } = useCreate();

  type FormValues = {
    nombre_contenant_plein: number;
    point_de_collecte: string;
  };

  function onSubmit(values: FormValues) {
    return mutate({
      resource: "taux_de_remplissage",
      values,
      successNotification: () => ({
        description: "Nombre de casiers pleins enregistré",
        message:
          "Merci d'avoir renseigné le nombre de casiers pleins, nous reviendrons vers vous rapidement",
        type: "success",
      }),
    });
  }

  if (pointDeCollecteData) {
    const { nom, id: pointDeCollecteId } = pointDeCollecteData.data;

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
          <h3>{nom}</h3>
          <Form
            layout="vertical"
            style={{ maxWidth: 200 }}
            onFinish={(values) =>
              onSubmit({ ...values, point_de_collecte: pointDeCollecteId })
            }
          >
            <Form.Item
              label="Nombre de casiers pleins"
              name={"nombre_contenant_plein"}
              rules={[
                {
                  required: true,
                },
              ]}
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
