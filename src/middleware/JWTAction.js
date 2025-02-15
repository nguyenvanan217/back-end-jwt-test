require("dotenv").config();
var jwt = require("jsonwebtoken");

const nonSecurePaths = ["/login", "/register", "/logout"];
const apiPrefix = "/api/v1";




const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRE });
    // console.log("token", token);
    return token;
  } catch (error) {
    console.log("error createJWT", error);
  }
  return token;
};
const verifyJWT = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log("error verifyJWT", error);
  }
  // console.log("data", data);
  return decoded;
};
const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.some(p => req.path === p || req.path === apiPrefix + p)) {
    return next();
  }
  let cookies = req.cookies;
  if (cookies && cookies.access_token) {
    let token = cookies.access_token;
    let decoded = verifyJWT(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EM: "Unauthorized users. Please log in ...",
        EC: -1,
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EM: "Unauthorized users. Please log in ...",
      EC: -1,
      DT: "",
    });
  }
};
const checkUserPermission = (req, res, next) => {
  if (req.path === "/account" || req.path === apiPrefix + "/account") {
    return next();
  }
  if (nonSecurePaths.some(p => req.path === p || req.path === apiPrefix + p)) {
    return next();
  }
  if (req.user) {
    let roles = req.user.groupWithRole.roles;
    let currentUrl = req.path;
    if (!roles || roles.length === 0) {
      return res.status(403).json({
        EM: "You don't have permission to access this resource",
        EC: -1,
        DT: "",
      });
    }
    let canAccess = roles.some((role) => currentUrl.includes(role.url));
    if (canAccess) {
      next();
    } else {
      return res.status(403).json({
        EM: "You don't have permission to access this resource",
        EC: -1,
        DT: "",
      });
    }
  }
};
module.exports = { createJWT, verifyJWT, checkUserJWT, checkUserPermission };
