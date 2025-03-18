import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./Routes/web";
import Connection from "./configs/connectDB";
import initAPIRoutes from "./Routes/api";
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

let app = express();
const server = http.createServer(app); // Dùng server này thay vì app.listen

app.use(
  cors({
    origin: process.env.REACT_URL,
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: process.env.REACT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Khi user tham gia, cho vào room dựa theo userId
  socket.on("joinRoom", (userId) => {
    socket.join(userId); // Tham gia room với userId
    console.log(`User ${userId} joined room`);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.receiverId).emit("receiveMessage", data); // Gửi tin nhắn đến room của user nhận
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Cấu hình view engine
configViewEngine(app);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Kiểm tra kết nối DB
Connection();

initWebRoutes(app);
initAPIRoutes(app);

// Chạy server thay vì app.listen
server.listen(process.env.PORT || 6969, () => {
  console.log(`🚀 App is running at the port: ${process.env.PORT || 6969} 🚀`);
});
