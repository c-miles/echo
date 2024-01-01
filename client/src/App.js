import React from "react";

function App() {
  const sendRequest = async () => {
    try {
      const response = await fetch("http://localhost:3000");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <div>
      <button onClick={sendRequest}>Send Request</button>
    </div>
  );
}

export default App;
