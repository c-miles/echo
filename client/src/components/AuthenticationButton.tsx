import React from "react";
import { useAuth0, LogoutOptions } from "@auth0/auth0-react";

const AuthenticationButton: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return isAuthenticated ? (
    <button
      onClick={() =>
        logout({ returnTo: window.location.origin } as LogoutOptions)
      }
    >
      Logout
    </button>
  ) : (
    <button onClick={() => loginWithRedirect()}>Login</button>
  );
};

export default AuthenticationButton;
