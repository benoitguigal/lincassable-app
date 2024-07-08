import { AccessControlProvider } from "@refinedev/core";
import authProvider from "./authProvider";
import { UserPermission } from "./interfaces";

const sidebarPermissions = ["collecte_menu.list", "dashboard.list"];

const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const permissionResponse = await authProvider.getPermissions();

    if (permissionResponse) {
      const { permissions } = permissionResponse;
      const permission = `${resource}.${action}`;
      const allPermissions = [...permissions, ...sidebarPermissions];
      if (allPermissions.includes(permission as UserPermission)) {
        return { can: true };
      }
    }
    return {
      can: false,
      reason: "Unauthorized",
    };
  },
};

export default accessControlProvider;
