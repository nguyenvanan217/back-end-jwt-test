import db from "../models/index";
const getGroup = async () => {
  try {
    let groups = await db.Group.findAll();
    if (groups) {
      return {
        EM: "Lấy tất cả nhóm thành công",
        EC: 0,
        DT: groups,
      };
    } else {
      return {
        EM: "Không tìm thấy nhóm nào",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Có lỗi xảy ra ở service!",
      EC: 1,
      DT: [],
    };
  }
};
module.exports = {
  getGroup,
};
