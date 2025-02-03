import { MailOutlined } from "@ant-design/icons";
import { Alert, Button, Modal } from "antd";
import { useState } from "react";
import { Mailing } from "../../types";
import MailingPreview from "./MailingPreview";
import { supabaseClient } from "../../utility";

type Props = {
  mailing: Mailing;
};

const MailingSendButton: React.FC<Props> = ({ mailing }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setError(null);
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    setError(null);
    setConfirmLoading(true);

    return supabaseClient.functions
      .invoke("envoi_mailing", {
        body: {
          mailing_id: mailing.id,
        },
      })
      .then((r) => {
        setConfirmLoading(false);
        if (r.error) {
          setError("Une erreur s'est produite pendant l'envoi des emails");
        } else {
          setIsModalOpen(false);
        }
      })
      .catch(() => {
        setError("Une erreur s'est produite pendant l'envoi des emails");
        setConfirmLoading(false);
      });
  };

  return (
    <>
      <Button icon={<MailOutlined />} title="Envoyer" onClick={showModal}>
        Prévisualiser et envoyer
      </Button>
      {isModalOpen && (
        <Modal
          title={`Prévisualiser et envoyer`}
          open={isModalOpen}
          onCancel={handleCancel}
          onOk={handleOk}
          okText="Envoyer"
          cancelText="Annuler"
          confirmLoading={confirmLoading}
        >
          <MailingPreview mailing={mailing} />
          {error && <Alert type="error" message={error} />}
        </Modal>
      )}
    </>
  );
};

export default MailingSendButton;
