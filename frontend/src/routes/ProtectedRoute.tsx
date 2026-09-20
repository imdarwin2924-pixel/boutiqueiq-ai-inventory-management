import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isLoading,
    user,
  } = useAuth();

  /*
   * Wait until the existing token has been
   * validated and the current user has loaded.
   */
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
        }}
      >
        Loading...
      </div>
    );
  }

  /*
   * User is not authenticated.
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
   * No role restriction means any
   * authenticated user can access the route.
   */
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  /*
   * Normalize the current user's role.
   */
  const currentRole =
    user?.role_name
      ?.trim()
      .toLowerCase();

  /*
   * Normalize allowed roles.
   */
  const normalizedAllowedRoles =
    allowedRoles.map(
      (role) =>
        role.trim().toLowerCase()
    );

  /*
   * User does not have the required role.
   */
  if (
    !currentRole ||
    !normalizedAllowedRoles.includes(
      currentRole
    )
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;