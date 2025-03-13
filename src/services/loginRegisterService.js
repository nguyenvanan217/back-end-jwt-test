import { createJWT } from "../middleware/JWTAction";
import { getGroupWithRole } from "./jwtService";
import db from "../models/index";
let bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const hashUserPassword = (userPassword) => {
  const hasPassword = bcrypt.hashSync(userPassword, salt);
  return hasPassword;
};
const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: {
      email: userEmail,
    },
  });
  if (user) {
    return true;
  }
  return false;
};
const registerNewUser = async (rawData) => {
  try {
    let isEmailExist = await checkEmailExist(rawData.email);
    if (isEmailExist === true) {
      return {
        EM: "Email đã được sử dụng",
        EC: "1",
      };
    }
    let hasPassword = hashUserPassword(rawData.password);
    await db.User.create({
      email: rawData.email,
      username: rawData.username,
      password: hasPassword,
      groupId: 2,
    });
    return {
      EM: "Đăng ký thành công",
      EC: "0",
    };
  } catch (error) {
    console.log("Error at registerNewUser: ", error);
    return {
      EM: "Có lỗi xảy ra với dịch vụ...",
      EC: "-2",
    };
  }
};
const loginUser = async (rawData) => {
  try {
    let user = await db.User.findOne({
      where: {
        email: rawData.email,
      },
    });
    if (!user) {
      return {
        EM: "Email không tồn tại",
        EC: "1",
      };
    }
    let checkPassword = bcrypt.compareSync(rawData.password, user.password);
    if (checkPassword === false) {
      return {
        EM: "Email hoặc mật khẩu không chính xác",
        EC: "2",
      };
    }
    let groupWithRole = await getGroupWithRole(user);
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      groupId: user.groupId,
      groupWithRole,
    };
    const token = createJWT(payload);
    return {
      EM: "Đăng nhập thành công",
      EC: "0",
      DT: {
        id: user.id,
        email: user.email,
        username: user.username,
        access_token: token,
        groupWithRole,
      },
    };
  } catch (error) {
    console.log("Error at loginUser: ", error);
    return {
      EM: "Có lỗi xảy ra với dịch vụ...",
      EC: "-2",
    };
  }
};
module.exports = { registerNewUser, checkEmailExist, loginUser };
