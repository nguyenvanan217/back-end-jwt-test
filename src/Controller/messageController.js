import messageService from "../services/messageService";
import { upload } from "../middleware/uploadImage";
import multer from "multer";
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
    console.log("Raw req.body before processing:", req.body); // Log dữ liệu thô từ request
    console.log("Raw req.files:", req.files);

    let { sender_id, receiver_id, content, created_at } = req.body || {};
    const imagePaths = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    console.log("Extracted content:", content);
    console.log("Image paths:", imagePaths);

    if ((!content || content.trim() === "") && imagePaths.length === 0) {
      return res.status(400).json({
        EM: "Message content or image is required",
        EC: "-1",
        DT: [],
      });
    }

    const formattedCreatedAt =
      created_at && moment(created_at, "YYYY-MM-DD HH:mm:ss").isValid()
        ? moment(created_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
        : moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
    console.log("Formatted created_at before saving:", formattedCreatedAt);

    const data = await messageService.sendMessage(
      sender_id,
      receiver_id,
      content || "",
      formattedCreatedAt,
      imagePaths.length > 0 ? imagePaths[0] : null
    );

    if (imagePaths.length > 1) {
      for (let i = 1; i < imagePaths.length; i++) {
        await messageService.sendMessage(sender_id, receiver_id, "", formattedCreatedAt, imagePaths[i]);
      }
    }
    
    console.log("Response data from service:", data);
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