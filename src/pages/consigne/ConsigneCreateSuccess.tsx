import { IResourceComponentsProps } from "@refinedev/core";
import { Result } from "antd";

const ConsigneCreateSuccess: React.FC<IResourceComponentsProps> = () => {
  const title = "Merci d'avoir renseigné vos données de consigne";

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Result status="success" title={title} />
    </div>
  );
};

export default ConsigneCreateSuccess;
