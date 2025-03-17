import { PageHeader } from "@refinedev/antd";
import StaffDashboard from "../components/dashboard/StaffDashboard";
import TransporteurDashboard from "../components/dashboard/TransporteurDashboard";
import { useGetIdentity, useNavigation } from "@refinedev/core";
import { Identity } from "../types";

const Dashboard: React.FC = () => {
  const { data: identity } = useGetIdentity<Identity>();

  const { list } = useNavigation();

  if (identity && identity.appRole === "transporteur") {
    list("tournee");
  }

  return (
    <div>
      <PageHeader title="Tableau de bord"></PageHeader>
      {identity && identity.appRole === "staff" && <StaffDashboard />}
      {identity && identity.appRole === "transporteur" && (
        <TransporteurDashboard />
      )}
    </div>
  );
};

export default Dashboard;
