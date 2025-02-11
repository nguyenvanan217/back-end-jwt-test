import { raw } from "body-parser";
import db from "../models";
import { sequelize } from "../models";
import { Op } from "sequelize";

const getUser = async (searchTerm = "") => {
  try {
    let searchCondition = searchTerm
      ? {
          username: { [Op.like]: `%${searchTerm}%` },
        }
      : {};

    let users = await db.User.findAll({
      where: searchCondition,
      attributes: [
        "id",
        "username",
        "email",
        [
          sequelize.fn("COUNT", sequelize.col("Transactions.bookId")),
          "borrowedBooksCount",
        ],
      ],
      include: [
        {
          model: db.Group,
          attributes: ["name", "description", "id"],
        },
        {
          model: db.Transactions,
          attributes: ["status"],
        },
      ],
      group: ["User.id", "Group.id"],
      order: [["id", "DESC"]],
      subQuery: false,
    });

    return {
      EM: "Lấy tất cả người dùng thành công",
      EC: 0,
      DT: users,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Có lỗi xảy ra ở service!",
      EC: 1,
      DT: [],
    };
  }
};

const getUserPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;

    const { rows, count } = await db.User.findAndCountAll({
      attributes: [
        "id",
        "username",
        "email",
        [
          sequelize.fn("COUNT", sequelize.col("Transactions.bookId")),
          "borrowedBooksCount",
        ],
      ],
      include: [
        {
          model: db.Group,
          attributes: ["name", "description", "id"],
        },
        {
          model: db.Transactions,
          attributes: ["status"],
        },
      ],
      group: ["User.id", "Group.id"],
      order: [["id", "DESC"]],
      limit: limit,
      offset: offset,
      subQuery: false,
    });

    return {
      EM: "Get all users successfully",
      EC: 0,
      DT: {
        totalRows: count.length,
        totalPages: Math.ceil(count.length / limit),
        users: rows,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong with the service!",
      EC: 1,
      DT: [],
    };
  }
};

const deleteUser = async (id) => {
  try {
    await db.Transactions.destroy({
      where: {
        userId: id,
      },
    });
    let user = await db.User.findOne({
      where: {
        id: id,
      },
    });
    if (user) {
      await user.destroy();
      return {
        EM: "Xóa người dùng thành công",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Không tìm thấy người dùng",
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

const updateCurrentUser = async (data) => {
  try {
    let user = await db.User.findOne({
      where: { id: data.id },
      include: [
        {
          model: db.Transactions,
          attributes: ["status"],
        },
      ],
    });

    if (!user) {
      return {
        EM: "User not found",
        EC: 1,
        DT: [],
      };
    }

    // Kiểm tra sự thay đổi của dữ liệu trước khi update
    let isUserUpdated = false;
    if (
      user.username !== data.username ||
      user.email !== data.email ||
      user.groupId !== data.group_id
    ) {
      await user.update({
        username: data.username,
        email: data.email,
        groupId: data.group_id,
      });
      isUserUpdated = true;
    }

    // Kiểm tra sự thay đổi của status
    const currentStatus = user.Transactions[0]?.status;
    let isStatusUpdated = false;
    if (data.status && currentStatus !== data.status) {
      await db.Transactions.update(
        { status: data.status },
        { where: { userId: data.id } }
      );
      isStatusUpdated = true;
    }

    // Kiểm tra nếu không có thay đổi
    if (!isUserUpdated && !isStatusUpdated) {
      return {
        EM: "Không có thay đổi nào",
        EC: 2,
        DT: [],
      };
    }

    return {
      EM: "Update user successfully",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      EM: "Something went wrong with the service!",
      EC: 1,
      DT: [],
    };
  }
};

const getStatus = async (userId) => {
  try {
    let status = await db.Transactions.findAll({
      attributes: ["status"],
      where: { userId: userId }, // Lọc theo userId
    });
    if (status.length > 0) {
      return {
        EM: "Get user status successfully",
        EC: 0,
        DT: status,
      };
    }
    return {
      EM: "No status found for the given user",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong with the service!",
      EC: 1,
      DT: [],
    };
  }
};

const getUserById = async (id) => {
  try {
    let user = await db.User.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: db.Group,
          attributes: ["name", "description", "id"],
        },
        {
          model: db.Transactions,
          include: [
            {
              model: db.Book,
              attributes: ["title", "author", "cover_image"],
            },
          ],
        },
      ],
    });
    if (user) {
      return {
        EM: "Get user details successfully",
        EC: 0,
        DT: user,
      };
    } else {
      return {
        EM: "Get user details failed",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong with the service!",
      EC: 1,
      DT: [],
    };
  }
};

const getAllUsersAndInfor = async () => {
  try {
    let users = await db.User.findAll({
      attributes: ["id", "username", "email"],
      include: [
        {
          model: db.Transactions,
          attributes: ["id", "borrow_date", "return_date", "status"],
          include: [
            {
              model: db.Book,
              attributes: ["title", "cover_image", "quantity"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
      raw: true,
      nest: true,
    });

    if (users && users.length > 0) {
      return {
        EM: "Lấy thông tin người dùng thành công",
        EC: 0,
        DT: users,
      };
    }

    return {
      EM: "Không tìm thấy dữ liệu người dùng",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.error("Error in getAllUsersAndInfor:", error);
    return {
      EM: "Lỗi dịch vụ!",
      EC: 1,
      DT: [],
    };
  }
};
const getAllUsersAndInforWithSearch = async (search) => {
  try {
    let users = await db.User.findAll({
      attributes: ["id", "username", "email"],
      include: [
        {
          model: db.Transactions,
          required: true,
          attributes: ["id", "borrow_date", "return_date", "status"],
          where: {
            borrow_date: {
              [Op.not]: null,
            },
            return_date: {
              [Op.not]: null,
            },
          },
          include: [
            {
              model: db.Book,
              attributes: ["title", "cover_image", "quantity"],
            },
          ],
        },
      ],
      where: {
        username: {
          [Op.like]: `%${search}%`,
        },
      },
      order: [["id", "DESC"]],
      raw: true,
      nest: true,
    });

    if (users && users.length > 0) {
      return {
        EM: "Lấy thông tin sinh viên mượn sách thành công",
        EC: 0,
        DT: users,
      };
    }

    return {
      EM: "Không tìm thấy sinh viên mượn sách",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.error("Error in getAllUsersAndInforWithSearch:", error);
    return {
      EM: "Lỗi dịch vụ!",
      EC: 1,
      DT: [],
    };
  }
};
const getAllUsersAndInforWithPaginate = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const { rows, count } = await db.User.findAndCountAll({
      attributes: ["id", "username", "email"],
      include: [
        {
          model: db.Transactions,
          required: true,
          attributes: ["id", "borrow_date", "return_date", "status"],
          where: {
            borrow_date: {
              [Op.not]: null,
            },
            return_date: {
              [Op.not]: null,
            },
          },
          include: [
            {
              model: db.Book,
              attributes: ["id", "title"],
            },
          ],
        },
      ],
      limit: limit,
      offset: offset,
      raw: true,
      nest: true,
      order: [["id", "DESC"]],
      subQuery: false,
    });

    if (count === 0) {
      return {
        EM: "Không tìm thấy sinh viên nào đã mượn sách",
        EC: 0,
        DT: {
          totalRows: 0,
          totalPages: 0,
          users: [],
        },
      };
    }
    const totalPages = Math.ceil(count / limit);
    return {
      EM: "Lấy danh sách sinh viên mượn sách thành công",
      EC: 0,
      DT: {
        totalRows: count,
        totalPages: totalPages,
        users: rows,
      },
    };
  } catch (error) {
    console.error("Error in getAllUsersAndInforWithPaginate:", error);
    return {
      EM: "Lỗi dịch vụ!",
      EC: 1,
      DT: [],
    };
  }
};
module.exports = {
  getUser,
  deleteUser,
  updateCurrentUser,
  getStatus,
  getUserById,
  getAllUsersAndInfor,
  getUserPagination,
  getAllUsersAndInforWithSearch,
  getAllUsersAndInforWithPaginate,
};
