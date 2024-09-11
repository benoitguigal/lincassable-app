import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Modal } from "antd";
import { useMemo, useState } from "react";
import TourneeMailForm from "./form";
import TourneeMailPreviewList from "./previewList";
import { Tournee, ZoneDeCollecte } from "../../../types";
import { supabaseClient } from "../../../utility";
import { renderMail } from "./helpers";

type TourneeMailButtonProps = {
  tournee: Tournee;
  zoneDeCollecte: ZoneDeCollecte;
};

const TourneeMailButton: React.FC<TourneeMailButtonProps> = ({
  tournee,
  zoneDeCollecte,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  const destinataires = Form.useWatch<number[]>("destinataires", form);

  const dateLimit = Form.useWatch<string>("dateLimit", form);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    return Promise.all(
      destinataires.map(async (destinataire) => {
        const { data } = await supabaseClient
          .from("point_de_collecte")
          .select()
          .eq("id", destinataire);

        if (data && data.length > 0) {
          const pointDeCollecte = data[0];

          const html = renderMail({
            dateLimit,
            dateTournee: tournee.date,
            pointDeCollecte,
          });

          return supabaseClient.functions
            .invoke("envoi_mail_avant_tournee", {
              body: {
                html,
                subject: "Collecte L'INCASSABLE",
                to: "benoit.guigal@gmail.com",
              },
            })
            .then(() => {
              setConfirmLoading(false);
              setIsModalOpen(false);
            })
            .catch(() => {
              setConfirmLoading(false);
            });
        }
      })
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        icon={<MailOutlined />}
        title="Envoyer un e-mail"
        onClick={showModal}
      />
      <Modal
        title={
          <div>
            <div>
              {zoneDeCollecte?.nom} {tournee.date}
            </div>
            <div>
              Demande de taux de remplissage par e-mail en amont d'une tournée
            </div>
          </div>
        }
        open={isModalOpen}
        okText="Envoyer"
        confirmLoading={confirmLoading}
        cancelText="Annuler"
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !destinataires?.length || !dateLimit }}
      >
        <TourneeMailForm form={form} zoneDeCollecte={zoneDeCollecte} />
        {destinataires?.length > 0 && dateLimit && (
          <TourneeMailPreviewList
            pointDeCollecteIds={destinataires ?? []}
            dateTournee={tournee.date}
            dateLimit={dateLimit}
          />
        )}
      </Modal>
    </>
  );
};

export default TourneeMailButton;
