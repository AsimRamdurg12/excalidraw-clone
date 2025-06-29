import { Navigate } from "react-router-dom";
import useLoggedIn from "../../hooks/useLoggedIn";
import type { ReactNode } from "react";

function AuthGuard({ children }: { children: ReactNode }) {
  const isLoggedIn = useLoggedIn(); // This function checks if the user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/user/authenticate" />;
  }
  return <>{children}</>;
}

export default AuthGuard;
