import React from "react";
import { RedirectLoginOptions, useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";

const AuthenticationButton: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return null;
  }

  const handleLogin = () => {
    loginWithRedirect({
      redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
    } as RedirectLoginOptions);
  };

  return (
    <Button
      variant="contained"
      onClick={handleLogin}
      sx={{ backgroundColor: "#424242" }}
    >
      Login
    </Button>
  );
};

export default AuthenticationButton;
