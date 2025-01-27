import loginRegisterService from "../services/loginRegisterService";
import userService from "../services/userServices";
const testApi = async (req, res) => {
  return await res.status(200).json({
    message: "Test API success",
  });
};
const handleRegister = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({
        EM: "Missing required fields",
        EC: "-1",
        DT: "",
      });
    }
    if (password && password.length < 4) {
      return res.status(200).json({
        EM: "Your password must have more than 3 letters",
        EC: "1",
        DT: "",
      });
    }
    let data = await loginRegisterService.registerNewUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at handleRegister: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};
const handleLogin = async (req, res) => {
  // console.log("req.cookies", req.cookies);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({
        EM: "Missing required fields",
        EC: "-1",
        DT: "",
      });
    }
    let data = await loginRegisterService.loginUser(req.body);
    if (data && data.DT && data.DT.access_token) {
      res.cookie("access_token", data.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at handleLogin: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search;
    const page = req.query.page;
    const limit = req.query.limit;

    // Nếu có search term, lấy tất cả kết quả không phân trang
    if (search && search.trim()) {
      let data = await userService.getUser(search);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: {
          users: data.DT,
          totalPages: 1,
          totalRows: data.DT.length,
        },
      });
    }

    // Nếu không có search, thực hiện phân trang
    if (page && limit) {
      let data = await userService.getUserPagination(+page, +limit);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }

    // Trường hợp không có params
    let data = await userService.getUser();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at getAllUsers: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    let data = await userService.deleteUser(req.body.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at deleteUser: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    let data = await userService.updateCurrentUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at updateUser: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};
const getStatusById = async (req, res) => {
  try {
    const userId = req.params.id;
    let data = await userService.getStatus(userId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at get Status: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};

const getUserDetailsById = async (req, res) => {
  try {
    let data = await userService.getUserById(req.params.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at getUserDetailsById: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};
const getAllUsersAndInfor = async (req, res) => {
  try {
    let data = await userService.getAllUsersAndInfor();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at getAllUsersAndInfor: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};
export default {
  testApi,
  handleRegister,
  handleLogin,
  getAllUsers,
  deleteUser,
  updateUser,
  getStatusById,
  getUserDetailsById,
  getAllUsersAndInfor,
};
