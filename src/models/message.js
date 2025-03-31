"use strict";
const { Model } = require("sequelize");
const moment = require('moment-timezone');
const Sequelize = require('sequelize');
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
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Sent", "Delivered", "Seen"),
        defaultValue: "Sent",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        get() {
            return moment(this.getDataValue("createdAt")).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
        },
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        get() {
            return moment.utc(this.getDataValue("updatedAt")).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
        },
    },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: false, 
    }
  );
  return Message;
};
