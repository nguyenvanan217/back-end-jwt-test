import groupService from "../services/groupService";
const readFunc = async (req, res) => {
  try {
    let data = await groupService.getGroup();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at getAllGroups: ", error);
    return res.status(500).json({
      EM: "Lỗi máy chủ nội bộ",
      EC: "-1",
      DT: "",
    });
  }
};
module.exports = {
  readFunc,
};
