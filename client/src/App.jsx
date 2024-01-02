import React from "react";
import { useNavigate } from "react-router-dom";

function App() {
  let navigate = useNavigate();

  const sendRequest = async () => {
    try {
      const response = await fetch("http://localhost:3000");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const goToChat = () => {
    navigate("/chat");
  };

  const getRangers = async () => {
    try {
      const response = await fetch("http://localhost:3000/power-rangers");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <div>
      <button onClick={sendRequest}>Send Request</button>
      <button onClick={getRangers}>Morphin' Time!</button>
      <button onClick={goToChat}>Go to Chat</button>
    </div>
  );
}

export default App;
