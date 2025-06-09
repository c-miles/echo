import React from "react";
import { RedirectLoginOptions, useAuth0 } from "@auth0/auth0-react";
import { Button } from "./atoms";

const AuthenticationButton: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return null;
  }

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
      }
    } as RedirectLoginOptions);
  };

  return (
    <Button
      variant="primary"
      onClick={handleLogin}
      size="lg"
    >
      Sign In
    </Button>
  );
};

export default AuthenticationButton;
