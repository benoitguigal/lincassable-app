import { PageHeader } from "@refinedev/antd";
import { StaffDashboard } from "../../components/dashboard/staff";
import { useGetIdentity } from "@refinedev/core";
import { IIdentity } from "../../interfaces";
import { TransporteurDashboard } from "../../components/dashboard/transporteur";

export const DashboardPage: React.FC = () => {
  const { data: identity } = useGetIdentity<IIdentity>();

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
