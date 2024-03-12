import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { Container, Typography, Button, TextField } from "@mui/material";

const App = () => {
  const socket = io("http://localhost:4040");

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketID] = useState("");
  
  const [msgs, setMsgs] = useState([]);
  console.log(msgs);



  const handleSubmit = (e) =>{
    e.preventDefault();
        socket.emit("message",{message, room} );
        // setMessage("");
  }

  useEffect(()=>{
    socket.on("connection" , () => {
      setSocketID(socket.id)
      console.log("connected", socket.id);
    })

        socket.on("Received-Message", (data) => {
          console.log(data);
        });

        socket.on("Received-Message", (data) => {
          console.log(data);
          setMsgs((msgs) => [...msgs, data])
        });


    socket.on("hello" , (msg) =>{
      console.log(msg);
    })


    return ()=>{
      socket.disconnect();
    }

  }, [])


  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="div">
        My Chat App
      </Typography>
      <Typography variant="h3" component="div" gutterBottom >
        {socketId }
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id='outlined-basic'
          label='Room'
          variant='outlined'
        />
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id='outlined-basic'
          label='Message'
          variant='outlined'
        />
        <Button type='submit' color="primary"> Send </Button>
      </form>
    </Container>
  );
}

export default App;