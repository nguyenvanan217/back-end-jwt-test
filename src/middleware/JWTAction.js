require("dotenv").config();
var jwt = require("jsonwebtoken");
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
  let cookies = req.cookies;
  console.log("cookies", cookies.access_token);
  if (cookies && cookies.access_token) {
    let token = cookies.access_token;
    let decoded = verifyJWT(token);
    if (decoded) {
      req.user = decoded;
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
module.exports = { createJWT, verifyJWT, checkUserJWT };
