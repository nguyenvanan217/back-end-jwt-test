import messageService from "../services/messageService";
const moment = require('moment-timezone');

const getChatHistory = async (req, res) => {
    try {
        let { userId } = req.params;
        userId = parseInt(userId);
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

const sendMessage = async (req, res, io) => { 
    try {
      // Log dữ liệu đầu vào để kiểm tra
      console.log("Raw req.body before processing:", req.body);
      console.log("Raw req.files:", req.files);
  
      // Lấy thông tin từ req.body
      let { sender_id, receiver_id, content, created_at } = req.body || {};
      // Lấy danh sách đường dẫn ảnh từ req.files
      const imagePaths = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
  
      console.log("Extracted content:", content);
      console.log("Image paths:", imagePaths);
  
      // Kiểm tra nếu không có nội dung và không có ảnh thì trả về lỗi
      if ((!content || content.trim() === "") && imagePaths.length === 0) {
        return res.status(400).json({
          EM: "Message content or image is required",
          EC: "-1",
          DT: [],
        });
      }
  
      // Định dạng thời gian created_at
      const formattedCreatedAt =
        created_at && moment(created_at, "YYYY-MM-DD HH:mm:ss").isValid()
          ? moment(created_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
          : moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
      console.log("Formatted created_at before saving:", formattedCreatedAt);
  
      let messages = []; // Mảng để lưu các tin nhắn đã gửi
  
      if (imagePaths.length > 0) {
        // Xử lý tin nhắn có ảnh
        for (let i = 0; i < imagePaths.length; i++) {
            const messageData = await messageService.sendMessage(
                sender_id, 
                receiver_id, 
                i < imagePaths.length - 1 ? "" : content || "",
                formattedCreatedAt,
                imagePaths[i]
            );
            messages.push(messageData.DT);
            
            // Emit riêng biệt cho từng người dùng
            io.in(sender_id.toString()).emit("message", {
                messageId: messageData.DT.message_id,
                sender_id,
                receiver_id,
                content: i < imagePaths.length - 1 ? "" : content || "",
                imageUrl: imagePaths[i],
                timestamp: formattedCreatedAt,
            });
            
            io.in(receiver_id.toString()).emit("message", {
                messageId: messageData.DT.message_id,
                sender_id,
                receiver_id,
                content: i < imagePaths.length - 1 ? "" : content || "",
                imageUrl: imagePaths[i],
                timestamp: formattedCreatedAt,
            });
        }
    } else {
        // Xử lý tin nhắn text
        const messageData = await messageService.sendMessage(
            sender_id, 
            receiver_id, 
            content || "", 
            formattedCreatedAt, 
            null
        );
        messages.push(messageData.DT);
        
        // Emit riêng biệt cho từng người dùng
        io.in(sender_id.toString()).emit("message", {
            messageId: messageData.DT.message_id,
            sender_id,
            receiver_id,
            content: content || "",
            imageUrl: null,
            timestamp: formattedCreatedAt,
        });
        
        io.in(receiver_id.toString()).emit("message", {
            messageId: messageData.DT.message_id,
            sender_id,
            receiver_id,
            content: content || "",
            imageUrl: null,
            timestamp: formattedCreatedAt,
        });
    }
  
      // Log dữ liệu trả về từ service
      console.log("Response data from service:", messages);
      return res.status(200).json({
        EM: "Gửi tin nhắn thành công",
        EC: "0",
        DT: messages, // Trả về tất cả tin nhắn đã gửi
      });
    } catch (error) {
      console.log("Error in sendMessage:", error);
      return res.status(500).json({
        EM: error.message || "Server error",
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
    getAllChat,
};