const db = require("../models");

const getUser = async (req, res) => {
  try {
    let users = await db.User.findAll({
      attributes: ["id", "username", "email"],
      include: [
        {
          model: db.Group,
          attributes: ["name", "description", "id"],
        },
      ],
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
    console.log("data", data);

    let user = await db.User.findOne({
      where: {
        id: data.id,
      },
    });

    if (!user) {
      return {
        EM: "User not found",
        EC: 1,
        DT: [],
      };
    }

    const isNoChange =
      user.username === data.username &&
      user.email === data.email &&
      user.groupId === data.group_id;

    if (isNoChange) {
      return {
        EM: "No changes to update.",
        EC: 1,
        DT: [],
      };
    }

  
    await user.update({
      username: data.username,
      email: data.email,
      groupId: data.group_id,
    });

    return {
      EM: "Update user successfully",
      EC: 0,
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
module.exports = {
  getUser,
  deleteUser,
  updateCurrentUser,
};
