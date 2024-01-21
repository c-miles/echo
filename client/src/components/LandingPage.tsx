import React, { CSSProperties } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import AuthenticationButton from "./AuthenticationButton";

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const styles = useStyles();

  return (
    <div style={styles.container}>
      <h1>Echo</h1>
      <p>
        Connect and engage effortlessly with Echo, your go-to video conferencing
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
