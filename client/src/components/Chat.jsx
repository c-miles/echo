import React from "react";
import io from "socket.io-client";

const SERVER_URL = "http://localhost:3000";

function Chat() {
  const [socket, setSocket] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [receivedMessages, setReceivedMessages] = React.useState([]);

  React.useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on("receiveMessage", (msg) => {
      setReceivedMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => newSocket.close();
  }, [setSocket]);

  const sendMessage = () => {
    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
    <div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <div>
        {receivedMessages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default Chat;
