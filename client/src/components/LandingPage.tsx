import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import AuthenticationButton from "./AuthenticationButton";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  const handleGoToRooms = () => {
    navigate("/rooms");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Echo</h1>
      <p>
        Connect and engage effortlessly with Echo, your go-to video conferencing
        solution.
      </p>

      {!isAuthenticated ? (
        <AuthenticationButton />
      ) : (
        <button onClick={handleGoToRooms}>Go to Your Room</button>
      )}
    </div>
  );
};

export default LandingPage;
