require("dotenv").config();
var jwt = require("jsonwebtoken");
const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRE });
    console.log("token", token);
    return token;
  } catch (error) {
    console.log("error createJWT", error);
  }
  return token;
};
const verifyJWT = (token) => {
  let key = process.env.JWT_SECRET;
  let data = null;
  try {
    let decoded = jwt.verify(token, key);
    data = decoded;
  } catch (error) {
    console.log("error verifyJWT", error);
  }
  console.log("data", data);
  return data;
};

module.exports = { createJWT, verifyJWT };
