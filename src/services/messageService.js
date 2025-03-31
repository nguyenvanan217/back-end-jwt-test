import db from "../models";
import { Op } from "sequelize"; 
import moment from "moment-timezone";
const getChatHistory = async (userId) => {
    try {
        if (!db.Message) {
            return {
                EM: "Message model not found",
                EC: "-1",
                DT: [],
            };
        }
        if (!db.User) {
            return {
                EM: "User model not found",
                EC: "-1",
                DT: [],
            };
        }
        const messages = await db.Message.findAll({
            where: {
                [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
            },
            include: [
                {
                    model: db.User,
                    as: "sender",
                    attributes: ["id", "username"],
                },
                {
                    model: db.User,
                    as: "receiver",
                    attributes: ["id", "username"],
                },
            ],
            order: [["createdAt", "ASC"]],
        });

        // Convert UTC times to Vietnam timezone
        const formattedMessages = messages.map(message => {
            const messageData = message.get({ plain: true });
            messageData.createdAt = moment(messageData.createdAt).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
            messageData.updatedAt = moment(messageData.updatedAt).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
            return messageData;
        });

        return {
            EM: "Get chat history successfully",
            EC: "0",
            DT: formattedMessages,
        };
    } catch (error) {
        console.log("Error in getChatHistory:", error);
        return {
            EM: "Get chat history failed",
            EC: "-1",
            DT: [],
        };
    }
};
const sendMessage = async (sender_id, receiver_id, content, created_at, image_url = null) => {
    try {
      console.log("Check before saving (should be GMT+7):", created_at);
  
      const message = await db.Message.create({
        sender_id,
        receiver_id,
        content,
        image_url,
        createdAt: created_at,
        updatedAt: created_at,
      });
  
      console.log("Saved message:", message.get({ plain: true }));
  
      return {
        EM: "Message sent successfully",
        EC: "0",
        DT: message.get({ plain: true }),
      };
    } catch (error) {
      console.log("Error in sendMessage:", error);
      return {
        EM: "Message sending failed",
        EC: "-1",
        DT: [],
      };
    }
};

const getAllChat = async () => {
    try {
        const messages = await db.Message.findAll({
            include: [
                {
                    model: db.User,
                    as: "sender",
                    attributes: ["id", "username", "email"],
                },
                {   
                    model: db.User,
                    as: "receiver",
                    attributes: ["id", "username", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        // Convert UTC times to Vietnam timezone
        const formattedMessages = messages.map(message => {
            const messageData = message.get({ plain: true });
            messageData.createdAt = moment(messageData.createdAt).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
            messageData.updatedAt = moment(messageData.updatedAt).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
            return messageData;
        });

        return {
            EM: "Lấy danh sách tin nhắn thành công",
            EC: 0,
            DT: formattedMessages,
        };
    } catch (error) {
        console.log("Error in getAllChat:", error);
        return {
            EM: "Lỗi server",
            EC: -1,
            DT: [],
        };
    }
};
export default {
    getChatHistory,
    sendMessage,
    getAllChat
};