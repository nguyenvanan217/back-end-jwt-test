import express from "express";
import userController from "../Controller/userController";
import groupController from "../Controller/groupController";
import bookController from "../Controller/bookController";
import transactionController from "../Controller/transactionController";
import roleController from "../Controller/roleController";
import messageController from '../controller/messageController';
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";
let router = express.Router();
const initAPIRoutes = (app) => {
  // Middleware kiểm tra JWT và phân quyền cho tất cả routes
  app.all("*", checkUserJWT, checkUserPermission);

  // Authentication routes
  router.post("/register", userController.handleRegister);         // Đăng ký tài khoản mới
  router.post("/login", userController.handleLogin);               // Đăng nhập
  router.post("/logout", userController.handleLogout);             // Đăng xuất

  // User management routes
  router.get("/users/read", userController.getAllUsers);           // Lấy danh sách người dùng
  router.delete("/users/delete", userController.deleteUser);       // Xóa người dùng
  router.get("/users/get-all-user-infor", userController.getAllUsersAndInfor);  // Lấy thông tin chi tiết tất cả người dùng
  router.put("/users/update", userController.updateUser);          // Cập nhật thông tin người dùng
  router.get("/users/get-detail/:id", userController.getUserDetailsById);// Lấy thông tin chi tiết một người dùng
  router.get("/status/read/:id", userController.getStatusById);    // Lấy trạng thái người dùng
  router.get("/get-admin-chat-id", userController.getAdminChatId); // Lấy ID chat của admin

  // Transaction routes
  router.post("/transactions/create", transactionController.createTransactionController);    // Tạo giao dịch mới
  router.put("/transactions/resolve-violation/:transactionId", transactionController.markViolationAsResolved);  // Xử lý vi phạm
  router.put("/transactions/update-date-and-status", transactionController.updateDateAndStatus);  // Cập nhật ngày và trạng thái
  router.put("/transactions/autoupdatestatus", transactionController.autoUpdateStatusInDB);  // Tự động cập nhật trạng thái
  router.delete("/transactions/delete/:id", transactionController.deleteTransaction);  // Xóa giao dịch

  // Book management routes
  router.get("/books/read", bookController.readFunc);             // Lấy danh sách sách
  router.post("/books/create", bookController.createBook);        // Thêm sách mới
  router.delete("/books/delete/:id", bookController.deleteBook);  // Xóa sách
  router.put("/books/update/:id", bookController.updateBook);     // Cập nhật thông tin sách

  // Genre management routes
  router.get("/genres/read", bookController.readGenre);           // Lấy danh sách thể loại
  router.post("/genres/create", bookController.addGenres);        // Thêm thể loại mới
  router.delete("/genres/delete/:id", bookController.deleteGenre);// Xóa thể loại

  // Group management routes
  router.get("/groups/read", groupController.readFunc);           // Lấy danh sách nhóm người dùng

  router.get("/roles/read", roleController.readFunc);            // Lấy danh sách vai trò
  router.get("/roles/read-group-with-role/:id", roleController.readGroupWithRole); // Lấy danh sách nhóm người dùng và vai trò

  router.put("/roles/update-role-for-group/:id", roleController.updateRoleForGroup); // Cập nhật vai trò cho nhóm người dùng
  // API get Account xử lý khi load lại trang ở front end giúp không mất thông tin của context phía front end
  router.get("/account", userController.getAccount);


  // Message routes
  router.get('/getChatHistory/:userId', messageController.getChatHistory);  // Lấy lịch sử chat
   router.post('/sendMessage', messageController.sendMessage);
   // get all chat của admin
  router.get('/getAllChat', messageController.getAllChat);
  return app.use("/api/v1", router);
};

export default initAPIRoutes;
