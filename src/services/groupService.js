import db from '../models/index';
const getGroup = async () => {
  try {
    let groups = await db.Group.findAll();
    if (groups) {
      return {
        EM: "Get all groups successfully",
        EC: 0,
        DT: groups,
      };
    } else {
      return {
        EM: "No group found",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrong width service !",
      EC: 1,
      DT: [],
    };
  }
};
module.exports = {
  getGroup,
};
