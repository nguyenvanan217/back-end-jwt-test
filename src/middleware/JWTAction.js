require("dotenv").config();
var jwt = require("jsonwebtoken");
const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRE });
    return token;
  } catch (error) {
    console.log("error createJWT", error);
  }
  return token;
};  
module.exports = { createJWT };
