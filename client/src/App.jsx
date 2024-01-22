import { Routes, Route, useLocation } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Room from "./components/Room";

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </>
  );
};

export default App;
