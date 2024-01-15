import React, { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import AuthenticationButton from "./AuthenticationButton";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const styles = useStyles();

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <h1>Echo</h1>
      <p>
        Connect and engage effortlessly with Echo, your go-to video conferencing
        solution.
      </p>

      {!isAuthenticated ? (
        <AuthenticationButton />
      ) : (
        <button onClick={handleGoToDashboard}>Go to Your Dashboard</button>
      )}
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
