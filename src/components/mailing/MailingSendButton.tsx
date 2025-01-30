import { MailOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import { Mailing } from "../../types";
import MailingPreview from "./MailingPreview";

type Props = {
  mailing: Mailing;
};

const MailingSendButton: React.FC<Props> = ({ mailing }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
          okText="Envoyer"
          cancelText="Annuler"
        >
          <MailingPreview mailing={mailing} />
        </Modal>
      )}
    </>
  );
};

export default MailingSendButton;
