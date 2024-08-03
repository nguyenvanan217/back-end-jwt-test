import express from "express";
import bodyParser from "body-parser"; //lấý dữ liệu như id , dùng query param
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./Routes/web";
require("dotenv").config();

let app = express();
//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
initWebRoutes(app);
configViewEngine(app)

let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("App is running at the port: " + port);
});
