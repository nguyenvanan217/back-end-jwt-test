import express from "express";
import bodyParser, { raw } from "body-parser";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./Routes/web";
import Connection from "./configs/connectdb";
import initAPIRoutes from "./Routes/api";
var cors = require('cors')
require("dotenv").config();

let app = express();
// app.use(cors({
//   origin: process.env.REACT_URL,
//   credentials: true,
// }));
app.use(cors())
// Cấu hình view engine
configViewEngine(app);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kiểm tra kết nối DB
Connection();

// // Hàm test transactions
// async function testTransactions() {
//   try {
//     const transactions = await db.User.findAll({
//        include: db.Transactions,
//        raw: true,
//        nest: true
//     });

//     console.log(transactions);
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//   }
// }
initWebRoutes(app);
initAPIRoutes(app)
// Gọi testTransactions() sau khi khởi động app
app.listen(process.env.PORT || 6969, () => {
  console.log("App is running at the port: " + (process.env.PORT || 6969));
  // testTransactions();
});

