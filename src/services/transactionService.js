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

module.exports = {
  autoUpdateStatusInDB,
  createTransactionService,
  updateTransactionStatuses,
  updateStatuses,
  cronSendEmail
};
