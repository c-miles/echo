import { Routes, Route, useLocation } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import Room from "./components/Room";
import Rooms from "./components/Rooms";

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/rooms" element={<Rooms />} />
      </Routes>
    </>
  );
};

export default App;
