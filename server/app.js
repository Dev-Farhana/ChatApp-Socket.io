// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);

//     const token = socket.request.cookies.token;
//     if (!token) return next(new Error("Authentication Error"));

//     const decoded = jwt.verify(token, secretKeyJWT);
//     next();
//   });
// });

// io.on("connection", (socket) => {
//   console.log("User Connected", socket.id);

//   socket.on("message", ({ room, message }) => {
//     console.log({ room, message });
//     socket.to(room).emit("receive-message", message);
//   });

//   socket.on("join-room", (room) => {
//     socket.join(room);
//     console.log(`User joined room ${room}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
// });

import  express  from "express";
import { Server} from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const server = createServer(app);

app.use(cors());
dotenv.config();

const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["POST" , "GET"],
        credentials: true
    }
})


io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("send_message", ({ room, message }) => {
    io.to(room).emit("new_message", message);
    console.log("new_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
