import db from "../models";


const readRoleService = async () => {
    try {
        if (!db.Role) {
            console.error("Model Roles không tồn tại!");
            return {
                EM: "Lỗi: Model Roles không tồn tại",
                EC: "-1",
                DT: "",
            };
        }

        const roles = await db.Role.findAll({
            attributes: ['id', 'url', 'description']
        });

        if (roles.length === 0) {
            return {
                EM: "Không tìm thấy dữ liệu",
                EC: "-1",
                DT: "",
            };
        }
        return {
            EM: "Lấy dữ liệu thành công",
            EC: "0",
            DT: roles,
        };
    } catch (error) {
        console.log("Error at get all roles: ", error);
        return {
            EM: "Lỗi trong quá trình xử lý",
            EC: "-1",
            DT: "",
        };
    }
};
const readGroupWithRoleService = async (id) => {
    try {
        const groups = await db.Group.findAll({
            attributes: ['id', 'name', 'description'],
            include: [
                {
                    model: db.Role,
                    attributes: ['id', 'url', 'description']
                }
            ],
            where: {
                id: id
            }
        });
        return {
            EM: "Lấy dữ liệu thành công",
            EC: "0",
            DT: groups,
        };
    } catch (error) {
        console.log("Error at get all roles: ", error);
        return {
            EM: "Lỗi trong quá trình xử lý",
            EC: "-1",
            DT: "",
        };
    }
}
export default {
    readRoleService,
    readGroupWithRoleService
};
