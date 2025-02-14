import db from "../models/index";

const getGroupWithRole = async (user) => {
  try {
    let group = await db.Group.findOne({
      where: {
        id: user.groupId,
      },
      attributes: ["id", "name", "description"],
      include: [
        {
          model: db.Role,
          attributes: ["id", "url", "description"],
          through: {
            model: db.groupRole,
            attributes: [],
          },
        },
      ],
      raw: false,
      nest: false,
    });

    if (group && group.Roles) {
      return {
        group: {
          id: group.get("id"),
          name: group.get("name"),
          description: group.get("description")
        },
        roles: group.Roles.map((role) => ({
          id: role.get("id"),
          url: role.get("url"),
          description: role.get("description"),
        }))
      };
    }
    return {
      group: null,
      roles: []
    };
  } catch (error) {
    console.error("Error in getGroupWithRole:", error);
    throw error;
  }
};

module.exports = { getGroupWithRole };
