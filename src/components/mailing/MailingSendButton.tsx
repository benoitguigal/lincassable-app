import { MailOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    return supabaseClient.functions
      .invoke("envoi_mailing", {
        body: {
          mailing_id: mailing.id,
        },
      })
      .then((r) => {
        console.log(JSON.stringify(r.data));
        setConfirmLoading(false);
        setIsModalOpen(false);
      })
      .catch(() => {
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
        </Modal>
      )}
    </>
  );
};

export default MailingSendButton;
