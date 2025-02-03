import { MailOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import { Mailing } from "../../types";
import MailingPreview from "./MailingPreview";

type Props = {
  mailing: Mailing;
};

const MailingRecapButton: React.FC<Props> = ({ mailing }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button icon={<MailOutlined />} title="Visualiser" onClick={showModal}>
        Visualiser les e-mails envoyés
      </Button>
      {isModalOpen && (
        <Modal
          title={`Visualiser les emails envoyés`}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          cancelText="Annuler"
        >
          <MailingPreview mailing={mailing} />
        </Modal>
      )}
    </>
  );
};

export default MailingRecapButton;
