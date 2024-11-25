import express from "express";
import apiController from "../Controller/apiController";
let router = express.Router();
const initAPIRoutes = (app) => {
  router.post("/register", apiController.handleRegister);
  router.post("/login", apiController.handleLogin);
  return app.use("/api/v1", router);
};
export default initAPIRoutes;
