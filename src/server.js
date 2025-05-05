import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./Routes/web";
import Connection from "./configs/connectDB";
import initAPIRoutes from "./Routes/api";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import setupSocket from "./setup/socket";
const cron = require('node-cron');
require("dotenv").config();
import transactionService from './services/transactionService';
const http = require("http");
const { Server } = require("socket.io");

// Khởi tạo app và server
let app = express();
const server = http.createServer(app);

// Khởi tạo Socket.IO
const io = new Server(server, {
  cors: {
      origin: process.env.REACT_URL,
      methods: ["GET", "POST"],
      credentials: true,
  },
});
// console.log('Socket.IO initialized:', io);

// Middleware
app.use(cors({
  origin: process.env.REACT_URL,
  credentials: true,
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
configViewEngine(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Kết nối DB và khởi tạo routes
Connection();
initWebRoutes(app);
initAPIRoutes(app, io);
// Cấu hình socket

setupSocket(io);


cron.schedule('24 18 * * *', async () => {
  try {
    console.log('Running scheduled task at 17:05...');
    const currentDate = new Date();
    console.log('Current time:', currentDate.toLocaleString());
    await transactionService.cronSendEmail();
  } catch (error) {
    console.error('Scheduled task error:', error);
  }
});

// Khởi động server
server.listen(process.env.PORT || 6969, () => {
  console.log(`🚀 App is running at the port: ${process.env.PORT || 6969} 🚀`);
});