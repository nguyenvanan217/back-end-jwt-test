import db from "../models";
import { Op } from "sequelize"; 

const getChatHistory = async (userId) => {
    try {
        const messages = await db.Message.findAll({
            where: {
                [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
            },
            include: [
                {
                    model: db.User,
                    as: "sender",
                    attributes: ["user_id", "name"],
                },
                {
                    model: db.User,
                    as: "receiver",
                    attributes: ["user_id", "name"],
                },
            ],
            order: [["created_at", "ASC"]], // Sắp xếp theo thời gian tăng dần
        });

        return {
            EM: "Get chat history successfully",
            EC: "0",
            DT: messages,
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
const sendMessage = async (sender_id, receiver_id, content, created_at) => {
    try {
        const message = await db.Message.create({
            sender_id: sender_id,
            receiver_id: receiver_id,
            content: content,
            created_at: created_at,
        });
        return {
            EM: "Message sent successfully",
            EC: "0",
            DT: message,
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
export default {
    getChatHistory,
    sendMessage,
};