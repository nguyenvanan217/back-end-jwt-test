import messageService from "../services/messageService";
const moment = require('moment-timezone');
const getChatHistory = async (req, res) => {
    try {
        let { userId } = req.params;
        userId = parseInt(userId);
        console.log(">>>>>>>>>>>>>.check userId", userId);
        if (isNaN(userId)) {
            return res.status(400).json({
                EM: "Invalid user ID",
                EC: "-2",
                DT: [],
            });
        }

        const data = await messageService.getChatHistory(userId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log("Error in getChatHistory:", error);
        return res.status(500).json({
            EM: "Server error",
            EC: "-1",
            DT: [],
        });
    }
};

const sendMessage = async (req, res) => {
    try {
        let { sender_id, receiver_id, content, created_at } = req.body;
        console.log("Check received created_at:", created_at);

        // Giữ nguyên giờ VN, không chuyển về UTC
        const formattedCreatedAt = moment(created_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        console.log("Formatted created_at before saving:", formattedCreatedAt);

        const data = await messageService.sendMessage(sender_id, receiver_id, content, formattedCreatedAt);
        console.log("Check data:", data);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log("Error in sendMessage:", error);
        return res.status(500).json({
            EM: "Server error",
            EC: "-1",
            DT: [],
        });
    }
};



const getAllChat = async (req, res) => {
    try {
        const data = await messageService.getAllChat();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log("Error in getAllChat:", error);
        return res.status(500).json({
            EM: "Server error",
            EC: "-1",
            DT: [],
        });
    }
};
export default {
    getChatHistory,
    sendMessage,
    getAllChat
};