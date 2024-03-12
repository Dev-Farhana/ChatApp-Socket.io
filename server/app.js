import  express  from "express";
import { Server} from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = 4040;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["POST" , "GET"],
        credentials: true
    }
})

app.get("/", (req,res) =>{
    res.send("API Working fine")
})

io.on("connection" , (socket) =>{
    console.log(`user connected`, socket.id);
    // socket.emit("hello", `Han bhai chal raha hon ${socket.id}`);
    // socket.broadcast.emit("hello" , `${socket.id} joined the chat group`);

    // socket.on("message", (data) =>{
    //     console.log(data);
    //     io.emit("Received-Message", data)
    // })

    socket.on("message", ({room, message}) =>{
        console.log({ room, message });
        io.to(room).emit("Received-Message" , message) ;  
    })

    socket.on("disconnect",()=>{
      console.log(`User disconnected ==> ${socket.id} `);
    });


})


server.listen(PORT, ()=>{
    console.log(`Server starts at ${PORT}`);
})