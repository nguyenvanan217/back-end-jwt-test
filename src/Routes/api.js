import express from "express";
import userController from "../Controller/userController";
import groupController from "../Controller/groupController";
import bookController from "../Controller/bookController";
let router = express.Router();
const initAPIRoutes = (app) => {
  router.post("/register", userController.handleRegister);
  router.post("/login", userController.handleLogin);
  router.get("/users/read", userController.getAllUsers);
  router.delete("/users/delete", userController.deleteUser);
  router.put("/users/update", userController.updateUser);



  
  router.get("/users/read/:id", userController.getUserDetailsById);
  router.get("/status/read/:id", userController.getStatusById);
  router.get("/books/read", bookController.readFunc);
  router.get("/groups/read", groupController.readFunc);

  return app.use("/api/v1", router);
};
export default initAPIRoutes;
