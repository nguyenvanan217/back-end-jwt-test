import db from "../models/index";
import emailService from './emailService'; 
const autoUpdateStatusInDB = async () => {
  try {
    const currentDate = new Date(); 
    const transactions = await db.Transactions.findAll({
      where: {
        status: {
          [db.Sequelize.Op.in]: ["Chờ trả", "Quá hạn"]
        }
      },
      include: [
        {
          model: db.User,
          attributes: ['email', 'username']
        },
        {
          model: db.Book,
          attributes: ['title']
        }
      ]
    });

    // Chỉ cập nhật status, không gửi email
    const { overdueTransactions, waitingTransactions, hasStatusChanges } = 
      await updateTransactionStatuses(transactions, currentDate);

    return {
      EM: hasStatusChanges ? "Cập nhật trạng thái thành công" : "Không có thay đổi",
      EC: 0,
      DT: {
        updatedTransactions: transactions,
        overdueTransactions,
        waitingTransactions,
        hasChanges: hasStatusChanges
      }
    };
  } catch (error) {
    console.log("Error:", error);
    return {
      EM: "Internal server error",
      EC: -1,
      DT: error.message,
    };
  }
};

const updateStatuses = async (overdueTransactions, waitingTransactions) => {
  try {
    // Cập nhật các giao dịch quá hạn
    if (overdueTransactions.length > 0) {
      await db.Transactions.update(
        { status: "Quá hạn" },
        { where: { id: overdueTransactions } }
      );
    }

    // Cập nhật các giao dịch chờ trả
    if (waitingTransactions.length > 0) {
      await db.Transactions.update(
        { status: "Chờ trả" },
        { where: { id: waitingTransactions } }
      );
    }
  } catch (error) {
    console.error("Error in updateStatuses:", error);
    throw error;
  }
};

const updateTransactionStatuses = async (transactions, currentDate) => {
  const currentDateString = currentDate.toISOString().split("T")[0];
  const overdueTransactions = [];
  const waitingTransactions = [];
  let hasStatusChanges = false;

  transactions.forEach(trans => {
    const shouldBeOverdue = trans.return_date < currentDateString;
    if (shouldBeOverdue && trans.status !== "Quá hạn") {
      overdueTransactions.push(trans.id);
      hasStatusChanges = true;
    } else if (!shouldBeOverdue && trans.status !== "Chờ trả") {
      waitingTransactions.push(trans.id);
      hasStatusChanges = true;
    }
  });

  if (hasStatusChanges) {
    await updateStatuses(overdueTransactions, waitingTransactions);
  }

  return { overdueTransactions, waitingTransactions, hasStatusChanges };
};

const createTransactionService = async (data) => {
  try {
    const book = await db.Book.findByPk(data.bookId);

    if (!book) {
      return {
        EM: "Không tìm thấy sách",
        EC: 1,
        DT: [],
      };
    }

    if (book.quantity <= 0) {
      return {
        EM: "Sách đã hết, không thể cho mượn",
        EC: 1,
        DT: [],
      };
    }

    const user = await db.User.findOne({
      where: { email: data.studentEmail },
    });

    if (!user) {
      return {
        EM: "Không tìm thấy sinh viên với email này",
        EC: 1,
        DT: [],
      };
    }

    const transaction = await db.Transactions.create({
      bookId: data.bookId,
      userId: user.id,
      borrow_date: data.borrowDate,
      return_date: data.returnDate,
      status: data.status,
    });

    await book.update({
      quantity: book.quantity - 1,
    });

    return {
      EM: "Đăng ký mượn sách thành công",
      EC: 0,
      DT: {
        transactionId: transaction.id,
        userId: user.id,
      },
    };
  } catch (error) {
    console.error("Error in createTransactionService:", error);
    return {
      EM: "Lỗi dịch vụ!",
      EC: 1,
      DT: [],
    };
  }
};

const cronSendEmail = async () => {
  try {
    const currentDate = new Date(); // Sử dụng ngày hiện tại
    const transactions = await db.Transactions.findAll({
      where: {
        status: {
          [db.Sequelize.Op.in]: ["Chờ trả", "Quá hạn"]
        }
      },
      include: [
        {
          model: db.User,
          attributes: ['email', 'username']
        },
        {
          model: db.Book,
          attributes: ['title']
        }
      ]
    });

    // Chỉ gửi email
    const emailsSent = await emailService.checkAndSendEmails(transactions, currentDate);

    return {
      EM: emailsSent ? "Gửi email thành công" : "Không có email nào được gửi",
      EC: 0,
      DT: { emailsSent }
    };
  } catch (error) {
    console.log("Error:", error);
    return {
      EM: "Internal server error", 
      EC: -1,
      DT: error.message
    };
  }
};

const extendLoanService = async (transactionId) => {
  try {
      // Tìm giao dịch
      const transaction = await db.Transactions.findOne({
          where: { 
              id: transactionId,
              status: 'Chờ trả'  // Chỉ cho phép gia hạn với sách đang mượn
          },
          include: [
              {
                  model: db.User,
                  attributes: ['email', 'username']
              },
              {
                  model: db.Book,
                  attributes: ['title']
              }
          ]
      });

      if (!transaction) {
          return {
              EM: "Không tìm thấy giao dịch hoặc sách không thể gia hạn",
              EC: 1,
              DT: []
          };
      }

      // Lưu ngày trả cũ trước khi cập nhật
      const oldReturnDate = new Date(transaction.return_date);
      
      // Tính ngày gia hạn mới (thêm 15 ngày từ ngày trả cũ)
      const newReturnDate = new Date(oldReturnDate);
      newReturnDate.setDate(oldReturnDate.getDate() + 15);

      // Cập nhật ngày trả mới
      await transaction.update({
          return_date: newReturnDate
      });

      // Gửi email thông báo gia hạn thành công
      const emailData = {
          username: transaction.User.username,
          bookTitle: transaction.Book.title,
          newReturnDate: newReturnDate.toLocaleDateString('vi-VN'),
          oldReturnDate: oldReturnDate.toLocaleDateString('vi-VN')
      };

      // Send email notification
      await emailService.transporter.sendMail({
           from: process.env.EMAIL_USER,
  to: transaction.User.email,
  subject: "📚 Gia hạn mượn sách thành công!",
  html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            ✅ Xác nhận gia hạn mượn sách
          </h2>
          
          <p style="font-size: 16px; color: #333;">👋 Xin chào <strong>${emailData.username}</strong>,</p>
          
          <p style="font-size: 16px; color: #333;">
            Bạn đã <span style="color: #27ae60; font-weight: bold;">gia hạn thành công</span> sách:
          </p>
          
          <p style="font-size: 18px; color: #2980b9; font-weight: bold; margin: 10px 0;">
            📘 <em>${emailData.bookTitle}</em>
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; background-color: #ecf0f1; font-weight: bold; width: 50%;">📅 Ngày trả sách cũ:</td>
              <td style="padding: 10px; background-color: #ffffff;">${emailData.oldReturnDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background-color: #ecf0f1; font-weight: bold;">🗓️ Ngày trả sách mới:</td>
              <td style="padding: 10px; background-color: #ffffff;">${emailData.newReturnDate}</td>
            </tr>
          </table>
          
          <p style="font-size: 15px; color: #e67e22; margin-top: 20px;">⚠️ Vui lòng trả sách đúng hạn để tránh phí phạt.</p>
          
          <p style="font-size: 16px; color: #333; margin-top: 30px;">
            Trân trọng,<br>📖 <strong>Thư viện Đại Học Khoa Học Huế</strong>
          </p>
        </div>
      `
  });

      return {
          EM: "Gia hạn sách thành công",
          EC: 0,
          DT: {
              newReturnDate: newReturnDate,
              transactionId: transaction.id
          }
      };

  } catch (error) {
      console.error("Error in extendLoanService:", error);
      return {
          EM: "Lỗi khi gia hạn sách",
          EC: -1,
          DT: []
      };
  }
};

module.exports = {
  autoUpdateStatusInDB,
  createTransactionService,
  updateTransactionStatuses,
  updateStatuses,
  cronSendEmail,
  extendLoanService
};
