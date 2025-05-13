import chatbotService from '../services/chatbotService';

const handleChatbotMessage = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({
                EM: "Message is required",
                EC: 1,
                DT: []
            });
        }

        const result = await chatbotService.generateBookResponse(message);
        
        return res.status(200).json(result);
    } catch (error) {
        console.error("Chatbot error:", error);
        return res.status(500).json({
            EM: "Internal server error",
            EC: -1,
            DT: []
        });
    }
};

export default {
    handleChatbotMessage
};