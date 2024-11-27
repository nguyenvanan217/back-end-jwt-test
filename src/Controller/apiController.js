import loginRegisterService from "../services/loginRegisterService";
import apiServices from "../services/apiServices";
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
  console.log("req.cookies", req.cookies);
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
    res.cookie("access_token", data.DT.access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      access_token: data.DT.access_token,
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
    let data = await apiServices.getUser();
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
    let data = await apiServices.deleteUser(req.body.id);
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

export default {
  testApi,
  handleRegister,
  handleLogin,
  getAllUsers,
  deleteUser,
};
