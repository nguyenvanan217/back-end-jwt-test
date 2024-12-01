import { raw } from "body-parser";
import db from "../models";
import { sequelize } from "../models";

const getUser = async (req, res) => {
  try {
    let users = await db.User.findAll({
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
    });
    if (users) {
      return {
        EM: "Get all users successfully",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "No user found",
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
        EM: "Delete user successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "User not found",
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
        EM: "Nothing to update",
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

// const getStatus = async (req, res) => {
//   try {
//     let status = await db.Transactions.findAll({
//       attributes: ["status"],
//     });
//     if (status) {
//       return {
//         EM: "Get all status successfully",
//         EC: 0,
//         DT: status,
//       };
//     }
//     return {
//       EM: "No status found",
//       EC: 1,
//       DT: [],
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       EM: "Something went wrong with the service!",
//       EC: 1,
//       DT: [],
//     };
//   }
// };
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
              attributes: ["title", "author", "cover_image"], // Chỉ lấy cột title từ bảng Book
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
module.exports = {
  getUser,
  deleteUser,
  updateCurrentUser,
  // getStatus,
  getUserById,
};
