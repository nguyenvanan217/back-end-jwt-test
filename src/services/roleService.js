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
// nếu các trường ở front end truyền xuống giống với các trường ở database thì không cần thêm
//và báo nothing to update
// nếu có trường ở front end truyền xuống khác với các trường ở database thì cập nhật
const updateRoleForGroupService = async (id, roles) => {
    try {
        // Lấy danh sách roles hiện tại từ DB
        const currentRoles = await db.Group_Role.findAll({
            where: { groupId: id },
            attributes: ["roleId"], // Chỉ lấy roleId
        });

        // Chuyển danh sách về mảng roleId đơn giản
        const currentRoleIds = currentRoles.map(role => role.roleId);

        // So sánh nếu không có thay đổi thì return luôn
        if (JSON.stringify(currentRoleIds.sort()) === JSON.stringify(roles.sort())) {
            return {
                EM: "Nothing to update",    
                EC: "1",
                DT: "",
            };
        }

        // Xóa những roles không có trong danh sách mới
        await db.Group_Role.destroy({
            where: {
                groupId: id,
                roleId: { [db.Sequelize.Op.notIn]: roles }, // Xóa những roles cũ không có trong danh sách mới
            },
        });

        // Thêm các roles mới chưa có trong DB
        const newRoles = roles.filter(role => !currentRoleIds.includes(role));
        for (const role of newRoles) {
            await db.Group_Role.create({
                groupId: id,
                roleId: role,
            });
        }

        return {
            EM: "Cập nhật vai trò thành công",
            EC: "0",
            DT: "",
        };
    } catch (error) {
        console.log("Error at update role for group: ", error);
        return {
            EM: "Lỗi trong quá trình xử lý",
            EC: "-1",
            DT: "",
        };
    }
};

export default {
    readRoleService,
    readGroupWithRoleService,
    updateRoleForGroupService
};
