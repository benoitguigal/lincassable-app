import { AccessControlProvider } from "@refinedev/core";
import authProvider from "./authProvider";

const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const permissionResponse = await authProvider.getPermissions();

    if (permissionResponse && resource) {
      const { role } = permissionResponse;

      if (role === "staff") {
        return { can: true };
      }

      if (role === "transporteur") {
        if (resource === "dashboard") {
          return { can: true };
        }

        if (resource === "collecte_menu") {
          return { can: true };
        }

        if (resource === "tournee") {
          if (action === "list" || action === "show" || action === "edit") {
            return { can: true };
          }
        }
      }
    }
    return {
      can: false,
      reason: "Vous n'êtes pas autorisé",
    };
  },
};

export default accessControlProvider;
