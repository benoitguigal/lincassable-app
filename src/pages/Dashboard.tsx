import { PageHeader } from "@refinedev/antd";
import StaffDashboard from "../components/dashboard/StaffDashboard";
import TransporteurDashboard from "../components/dashboard/TransporteurDashboard";
import { useGetIdentity } from "@refinedev/core";
import { Identity } from "../types";

const Dashboard: React.FC = () => {
  const { data: identity } = useGetIdentity<Identity>();

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
