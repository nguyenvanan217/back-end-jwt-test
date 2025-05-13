import axios from 'axios';
import db from '../models';
import { Op, Sequelize } from 'sequelize';
const GEMINI_API_KEY = 'AIzaSyDwuS3VAEFRZc6PQ-kIMeT1TKS6nlzjN-I';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const extractSearchTerms = (message) => {
    // Chuẩn hóa message
    const normalizedMsg = message.toLowerCase();
    
    // Phân loại câu hỏi
    if (normalizedMsg.includes('những sách nào') || 
        normalizedMsg.includes('sách gì') ||
        normalizedMsg.includes('danh sách') ||
        normalizedMsg.includes('tất cả sách')) {
        return 'LIST_ALL';
    }

    // Loại bỏ các từ không cần thiết cho tìm kiếm cụ thể
    const wordsToRemove = [
        'thư viện', 'có', 'sách', 'không', 'cho', 'tôi', 'hỏi', 'về', 'cuốn', 
        'mày', 'của', 'những', 'các', 'trong', 'là'
    ];
    let searchTerms = normalizedMsg;
    
    wordsToRemove.forEach(word => {
        searchTerms = searchTerms.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
    });

    return searchTerms.trim().split(/\s+/).filter(term => term.length > 1);
};

const isBookRelatedQuery = (message) => {
    const bookRelatedTerms = [
        'sách', 'đọc', 'tác giả', 'thể loại', 'cuốn', 'tập', 'quyển',
        'truyện', 'thư viện', 'mượn sách', 'trả sách'
    ];
    
    const normalizedMsg = message.toLowerCase();
    return bookRelatedTerms.some(term => normalizedMsg.includes(term));
};

const isGeneralGreeting = (message) => {
    const greetings = ['hi', 'hello', 'chào', 'xin chào', 'alo', 'hey'];
    const normalizedMsg = message.toLowerCase();
    return greetings.some(greeting => normalizedMsg.includes(greeting));
};

const getRandomGreeting = () => {
    const greetings = [
        "Xin chào! Mình là trợ lý thư viện, mình có thể giúp gì cho bạn?",
        "Chào bạn! Bạn cần tìm sách gì không?",
        "Hi! Mình có thể giúp bạn tìm sách hoặc trả lời các câu hỏi về thư viện.",
        "Chào bạn! Hôm nay bạn muốn đọc sách gì?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
};

const generateBookResponse = async (userMessage) => {
    try {
        console.log("Original message:", userMessage);

        // Xử lý lời chào
        if (isGeneralGreeting(userMessage)) {
            return {
                EM: "Chatbot response generated",
                EC: 0,
                DT: {
                    message: getRandomGreeting()
                }
            };
        }

        // Kiểm tra xem câu hỏi có liên quan đến sách không
        if (!isBookRelatedQuery(userMessage)) {
            const suggestions = [
                "Xin lỗi, mình chỉ có thể giúp bạn với các vấn đề về sách và thư viện thôi.",
                "Mình là trợ lý thư viện, bạn cần tìm sách gì không?",
                "Bạn muốn tìm hiểu về sách nào trong thư viện không?",
                "Mình có thể giới thiệu cho bạn một số sách hay. Bạn thích thể loại nào?"
            ];
            
            return {
                EM: "Chatbot response generated",
                EC: 0,
                DT: {
                    message: suggestions[Math.floor(Math.random() * suggestions.length)]
                }
            };
        }
        
        const searchTerms = extractSearchTerms(userMessage);
        console.log("Search terms:", searchTerms);

        let books;
        
        // Xử lý trường hợp liệt kê tất cả sách
        if (searchTerms === 'LIST_ALL') {
            books = await db.Book.findAll({
                include: [{
                    model: db.Genres,
                    attributes: ['name']
                }],
                limit: 10 // Giới hạn số lượng sách trả về
            });
        } else if (searchTerms.length === 0) {
            return {
                EM: "Chatbot response generated",
                EC: 0,
                DT: {
                    message: "Xin chào! Tôi có thể giúp bạn tìm sách. Bạn có thể hỏi về:\n" +
                            "- Danh sách sách trong thư viện\n" +
                            "- Tìm sách theo tên\n" +
                            "- Tìm sách theo tác giả\n" +
                            "- Tìm sách theo thể loại",
                    relatedBooks: []
                }
            };
        } else {
            // Tìm kiếm theo điều kiện
            const searchConditions = searchTerms.map(term => ({
                [Op.or]: [
                    {
                        title: Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('Book.title')),
                            'LIKE',
                            `%${term}%`
                        )
                    },
                    {
                        author: Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('Book.author')),
                            'LIKE',
                            `%${term}%`
                        )
                    }
                ]
            }));

            books = await db.Book.findAll({
                include: [{
                    model: db.Genres,
                    attributes: ['name']
                }],
                where: {
                    [Op.or]: searchConditions 
                }
            });
        }

        if (!books || books.length === 0) {
            return {
                EM: "Chatbot response generated",
                EC: 0,
                DT: {
                    message: "Xin lỗi, mình không tìm thấy sách phù hợp với yêu cầu của bạn. Bạn có thể thử tìm với từ khóa khác không?"
                }
            };
        }

        const bookContext = books.map(book => ({
            title: book.title,
            author: book.author,
            genre: book.Genre?.name,
            quantity: book.quantity,
            available: book.quantity > 0 ? "còn sách" : "hết sách"
        }));
        console.log("Book context:", bookContext);

        const prompt = `
            Bạn là trợ lý thư viện thân thiện và nhiệt tình. 
            Hãy trả lời dựa trên thông tin sách sau:
            ${JSON.stringify(bookContext, null, 2)}
            
            Câu hỏi: "${userMessage}"
            
            Yêu cầu:
            1. Trả lời tự nhiên như đang trò chuyện
            2. Tóm tắt thông tin sách ngắn gọn, dễ hiểu
            3. Thêm gợi ý phù hợp nếu có thể
            4. Không liệt kê thông tin chi tiết về sách
            5. Luôn kết thúc với câu hỏi gợi mở hoặc đề xuất
        `;

        // Gửi prompt tới Gemini API
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }
        );

        return {
            EM: "Chatbot response generated",
            EC: 0,
            DT: {
                message: response.data.candidates[0].content.parts[0].text
            }
        };
    } catch (error) {
        console.error('Chatbot error:', error);
        console.error('Error details:', error.response?.data || error.message);
        return {
            EM: "Error generating response",
            EC: -1,
            DT: { 
                message: "Xin lỗi, mình đang gặp chút vấn đề. Bạn có thể hỏi lại sau được không?"
            }
        };
    }
};

export default {
    generateBookResponse
};