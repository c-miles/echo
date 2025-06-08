import React, { CSSProperties, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import AuthenticationButton from "./AuthenticationButton";

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const styles = useStyles();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={styles.container}>
      <h1>yap</h1>
      <p>
        Connect and engage effortlessly with yap, your go-to video conferencing
        solution.
      </p>

      {!isAuthenticated && <AuthenticationButton />}
    </div>
  );
};

export default LandingPage;

const useStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    marginTop: "50px",
    textAlign: "center",
  },
});
