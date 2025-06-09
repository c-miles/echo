import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AuthenticationButton from "./AuthenticationButton";

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold tracking-tight text-text mb-6">yap</h1>
        <p className="text-xl text-text-muted mb-8">
          Connect and engage effortlessly with yap, your go-to video conferencing
          solution.
        </p>
        
        {!isAuthenticated && (
          <AuthenticationButton />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
