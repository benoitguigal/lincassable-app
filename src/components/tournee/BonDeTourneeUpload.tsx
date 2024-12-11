import { Button, message, Upload, UploadProps } from "antd";
import { Tournee, ZoneDeCollecte } from "../../types";
import { UploadOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../utility";
import { RcFile } from "antd/es/upload";
import slugify from "../../utility/slugify";
import { useState } from "react";
import { UploadFile } from "antd/lib";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

function getPublicUrl(filePath: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${filePath}`;
}

/**
 * Permet d'extraire le nom du fichier après le nom du bucket
 * Ex : bon-de-tournee/2024-11-01-marseille-centre.pdf => 2024-11-01-marseille-centre.pdf
 */
function getFileName(filePath: string): string {
  return filePath.split("/").pop() ?? "";
}

type BonDeTourneeUploadProps = {
  tournee: Tournee;
  zoneDeCollecte: ZoneDeCollecte;
};

const props: UploadProps = {
  name: "file",
  method: "put",
  headers: {
    authorization: "authorization-text",
  },
  accept: "image/*, application/pdf",
  multiple: false,
  maxCount: 1,
};

const BonDeTourneeUpload: React.FC<BonDeTourneeUploadProps> = ({
  tournee,
  zoneDeCollecte,
}) => {
  const initialFileList = tournee.bon_de_tournee
    ? [
        {
          uid: tournee.id.toString(),
          name: getFileName(tournee.bon_de_tournee),
          url: getPublicUrl(tournee.bon_de_tournee),
        },
      ]
    : [];

  const [fileList, setFileList] = useState<UploadFile[]>(initialFileList);

  const action = async (file: RcFile) => {
    const randomStr = (Math.random() + 1).toString(36).substring(7);
    const extension = file.name.split(".").pop();
    const fileName = `${tournee.date}-${slugify(
      zoneDeCollecte.nom
    )}-${randomStr}.${extension}`;
    const { data, error } = await supabaseClient.storage
      .from("bon-de-tournee")
      .createSignedUploadUrl(fileName);
    if (error) {
      throw error;
    }
    return data.signedUrl;
  };

  const onChange: UploadProps["onChange"] = async (info) => {
    let newFileList = [...info.fileList];

    if (info.file.status === "done" && info.file.response?.Key) {
      const { error } = await supabaseClient
        .from("tournee")
        .update({ bon_de_tournee: info.file.response?.Key })
        .eq("id", tournee.id);
      if (error) {
        throw error;
      }
    }

    // Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response?.Key) {
        // Component will show file.url as link
        file.name = getFileName(file.response.Key);
        file.url = getPublicUrl(file.response.Key);
      }
      return file;
    });

    setFileList(newFileList);
  };

  const onRemove: UploadProps["onRemove"] = async () => {
    const { error } = await supabaseClient
      .from("tournee")
      .update({ bon_de_tournee: null })
      .eq("id", tournee.id);
    if (error) {
      message.error(error.message);
      return false;
    }
  };

  return (
    <Upload
      {...props}
      action={action}
      onChange={onChange}
      fileList={fileList}
      onRemove={onRemove}
    >
      <Button icon={<UploadOutlined />}>Téléverser</Button>
    </Upload>
  );
};

export default BonDeTourneeUpload;
