import express from "express";
import apiController from "../Controller/apiController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/test-api", apiController.testApi);
  return app.use("/api/v1", router);
};

export default initWebRoutes;