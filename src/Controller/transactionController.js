import db from "../models";
import transactionService from "../services/transactionService";
import emailService from "../services/emailService";

const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    if (transactionId) {
      const result = await db.Transactions.destroy({
        where: {
          id: transactionId,
        },
      });

      if (result === 0) {
        return res.status(404).json({
          EM: "Transaction not found",
          EC: 1,
          DT: [],
        });
      }

      return res.status(200).json({
        EM: "Transaction deleted successfully",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: "Something went wrong with the service!",
      EC: 1,
      DT: [],
    });
  }
};

const autoUpdateStatusInDB = async (req, res) => {
  try {
    let data = await transactionService.autoUpdateStatusInDB();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at auto update Status: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};

const updateDateAndStatus = async (req, res) => {
  try {
    const transactions = req.body;
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        EM: "Invalid data format",
        EC: 1,
        DT: [],
      });
    }

    let hasChanges = false;

    for (const transaction of transactions) {
      const { id, borrow_date, return_date } = transaction;

      const existingTransaction = await db.Transactions.findByPk(id);
      if (!existingTransaction) {
        return res.status(404).json({
          EM: `Transaction with id ${id} not found`,
          EC: 1,
          DT: [],
        });
      }

      if (
        existingTransaction.borrow_date !== borrow_date ||
        existingTransaction.return_date !== return_date
      ) {
        await existingTransaction.update({
          borrow_date,
          return_date,
        });
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return res.status(200).json({
        EM: "Không có thay đổi nào",
        EC: 2,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Cập nhật thành công",
      EC: 0,
      DT: [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: "Something went wrong with the service!",
      EC: 1,
      DT: [],
    });
  }
};

const markViolationAsResolved = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        EM: "Missing transaction ID",
        EC: 1,
        DT: [],
      });
    }

    const transaction = await db.Transactions.findOne({
      where: { id: transactionId },
      include: [
        {
          model: db.Book,
        },
        {
          model: db.User,
          attributes: ['email', 'username']
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        EM: "Không tìm thấy giao dịch",
        EC: 1,
        DT: [],
      });
    }

    // Chuẩn bị dữ liệu cho email template
    const emailData = {
      username: transaction.User.username,
      bookTitle: transaction.Book.title,
      status: transaction.status,
      returnDate: new Date().toLocaleDateString('vi-VN')
    };

    // Lấy template và gửi email
    const { subject, html } = emailService.returnBookTemplate(emailData);
    const emailSent = await emailService.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: transaction.User.email,
      subject,
      html 
    });

    // Cập nhật status transaction
    await transaction.update({
      status: "Đã trả",
    });

    // Tăng số lượng sách
    await transaction.Book.update({
      quantity: transaction.Book.quantity + 1,
    });

    return res.status(200).json({
      EM: emailSent 
        ? "Cập nhật trạng thái và gửi email thành công" 
        : "Cập nhật trạng thái thành công, nhưng không gửi được email",
      EC: 0,
      DT: [],
    });
  } catch (error) {
    console.log("Error at markViolationAsResolved: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};

const createTransactionController = async (req, res) => {
  try {
    const data = req.body;

    // Validate input
    if (
      !data.bookId ||
      !data.studentEmail ||
      !data.borrowDate ||
      !data.returnDate
    ) {
      return res.status(400).json({
        EM: "Thiếu thông tin cần thiết",
        EC: 1,
        DT: [],
      });
    }

    let result = await transactionService.createTransactionService(data);

    return res.status(200).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    });
  } catch (error) {
    console.log("Error at createTransactionController: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};

module.exports = {
  deleteTransaction,
  autoUpdateStatusInDB,
  updateDateAndStatus,
  markViolationAsResolved,
  createTransactionController,
};
