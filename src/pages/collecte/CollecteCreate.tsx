import { IResourceComponentsProps } from "@refinedev/core";
import CollecteFormWrapper from "../../components/collecte/CollecteFormWrapper";

const CollecteCreate: React.FC<IResourceComponentsProps> = () => {
  return <CollecteFormWrapper action="create" />;
};

export default CollecteCreate;
