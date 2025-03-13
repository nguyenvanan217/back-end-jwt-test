import roleService from "../services/roleService";

const readFunc = async (req, res) => {
    try {
        const response = await roleService.readRoleService();
        return res.status(200).json({
            EM: response.EM,
            EC: response.EC,
            DT: response.DT,
          });
    } catch (error) {
        console.log("Error at get all roles: ", error);
        return res.status(500).json({
          EM: "Lỗi máy chủ nội bộ",
          EC: "-1",
          DT: "",
        });
    }
}
const readGroupWithRole = async (req, res) => {
    try {
        const response = await roleService.readGroupWithRoleService(req.params.id);
        return res.status(200).json({
            EM: response.EM,
            EC: response.EC,
            DT: response.DT,
          });
    } catch (error) {
        console.log("Error at get all roles: ", error);
        return res.status(500).json({
          EM: "Lỗi máy chủ nội bộ",
          EC: "-1",
          DT: "",
        });
    }
}
const updateRoleForGroup = async (req, res) => {
    try {
        console.log(">>>>>>>>>>req.body: ", req.body.roles);
        console.log("req.params: ", req.params);
        console.log("req.params.id: ", req.params.id);
        const response = await roleService.updateRoleForGroupService(req.params.id, req.body.roles);
        return res.status(200).json({
            EM: response.EM,
            EC: response.EC,
            DT: response.DT,
          });
    } catch (error) {
        console.log("Error at update role for group: ", error);
        return res.status(500).json({
            EM: "Lỗi máy chủ nội bộ",
            EC: "-1",
            DT: "",
          });
    }
}
export default {
    readFunc,
    readGroupWithRole,
    updateRoleForGroup
}
