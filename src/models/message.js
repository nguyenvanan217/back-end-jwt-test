"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // Liên kết với User
      Message.belongsTo(models.User, { foreignKey: "sender_id", as: "sender" });
      Message.belongsTo(models.User, { foreignKey: "receiver_id", as: "receiver" });
    }
  }
  Message.init(
    {
      message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Sent", "Delivered", "Seen"),
        defaultValue: "Sent",
      },
      createdAt: { 
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: true, 
    }
  );
  return Message;
};
