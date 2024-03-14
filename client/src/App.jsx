import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const CONNECTION_PORT = "http://localhost:8000";
let socket;

const App = () => {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const userName = "Anonymous";

  useEffect(() => {
    socket = io(CONNECTION_PORT, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("new_message", (message) => {
      if (message && message.content) {
        setMessageList((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
    console.log("join_room", room);
  };

  const sendMessage = async () => {
    if (message === "") {
      return;
    }

    const messageContent = {
      room: room,
      content: {
        author: userName,
        message: message,
      },
    };

    if (socket && messageContent.content) {
      await socket.emit("send_message", messageContent);
      console.log(messageContent);
      setMessageList((prev) => [...prev, messageContent]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Real-time Chat</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="border-2 border-gray-300 rounded-lg px-4 py-2 mr-2"
        />
        <button
          onClick={connectToRoom}
          className="bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Join Room
        </button>
      </div>
      <div className="flex flex-col w-full max-w-md">
        <div className="overflow-y-auto h-96">
          {messageList?.map((message, index) => (
            <div key={index}>
              {/* <p className="text-lg font-bold">{message.author}:</p> */}
              <p className="text-lg font-bold">
                {message.content.author ? message.content.author : "Anonymous"}:
              </p>
              <p className="text-lg">{message.content.message}</p>
              {/* <p className="text-lg">{message.message}</p> */}
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 mr-2 flex-grow"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
