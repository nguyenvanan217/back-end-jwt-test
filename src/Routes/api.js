import express from "express";
import userController from "../Controller/userController";
import groupController from "../Controller/groupController";
import bookController from "../Controller/bookController";
import transactionController from "../Controller/transactionController";
let router = express.Router();
const initAPIRoutes = (app) => {
  router.post("/register", userController.handleRegister);
  router.post("/login", userController.handleLogin);
  router.get("/users/read", userController.getAllUsers);
  router.delete("/users/delete", userController.deleteUser);
  router.put(
    "/transactions/resolve-violation/:transactionId",
    transactionController.markViolationAsResolved
  );
  router.post(
    "/transactions/create",
    transactionController.createTransactionController
  );
  router.get("/users/get-all-user-infor", userController.getAllUsersAndInfor);
  router.put("/users/update", userController.updateUser);
  router.put(
    "/transactions/update-date-and-status",
    transactionController.updateDateAndStatus
  );
  router.put(
    "/transactions/autoupdatestatus",
    transactionController.autoUpdateStatusInDB
  );
  router.delete(
    "/transactions/delete/:id",
    transactionController.deleteTransaction
  );
  router.get("/users/read/:id", userController.getUserDetailsById);
  router.get("/status/read/:id", userController.getStatusById);

  router.get("/genres/read", bookController.readGenre);
  router.get("/books/read", bookController.readFunc);
  router.post("/books/create", bookController.createBook);
  router.delete("/books/delete/:id", bookController.deleteBook);
  router.post("/genres/create", bookController.addGenres);
  router.delete("/genres/delete/:id", bookController.deleteGenre);
  router.put("/books/update/:id", bookController.updateBook);

  router.get("/groups/read", groupController.readFunc);

  router.post("/logout", userController.handleLogout);

  return app.use("/api/v1", router);
};
export default initAPIRoutes;
