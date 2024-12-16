import { useTable } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Consigne } from "../../types";

const ConsigneList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, tableQueryResult } = useTable<Consigne>({
    syncWithLocation: true,
    pagination: { mode: "server", pageSize: 15 },
    sorters: {
      mode: "server",
      initial: [{ field: "date", order: "desc" }],
    },
  });

  return <div>Liste des consignes</div>;
};

export default ConsigneList;
