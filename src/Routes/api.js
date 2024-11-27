import express from "express";
import apiController from "../Controller/apiController";
import groupController from "../Controller/groupController";
let router = express.Router();
const initAPIRoutes = (app) => {
  router.post("/register", apiController.handleRegister);
  router.post("/login", apiController.handleLogin);
  router.get("/users/read", apiController.getAllUsers);
  router.delete("/users/delete", apiController.deleteUser);

  router.get("/groups/read", groupController.readFunc);
  return app.use("/api/v1", router);
};
export default initAPIRoutes;
