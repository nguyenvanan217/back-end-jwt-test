import db from "../models/index";
const nodemailer = require("nodemailer");
const transporter = require("./emailService").transporter;

const sendEmailNotification = async (transaction, daysUntilReturn) => {
  let emailSubject = '';
  let emailContent = '';

  if (daysUntilReturn === 3) {
    emailSubject = "Nhắc nhở: Sắp đến hạn trả sách (còn 3 ngày)";
  } else if (daysUntilReturn === 2) {
    emailSubject = "Nhắc nhở: Sắp đến hạn trả sách (còn 2 ngày)";
  } else if (daysUntilReturn === 1) {
    emailSubject = "Cảnh báo: Ngày mai là hạn cuối trả sách";
  } else if (daysUntilReturn <= 0) {
    emailSubject = `Cảnh báo: Bạn đã quá hạn mượn sách ${Math.abs(daysUntilReturn)} ngày`;
  }

  if (emailSubject) {
    emailContent = `
      Kính gửi ${transaction.User.username},
      
      ${emailSubject} cho cuốn sách "${transaction.Book.title}".
      Ngày hẹn trả: ${transaction.return_date}
      
      Vui lòng trả sách đúng hạn để tránh và giảm thiểu các hình thức xử phạt.
      
      Trân trọng,
      Thư viện Đại Học Khoa Học Huế
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: transaction.User.email,
      subject: emailSubject,
      text: emailContent
    });
  }
};

const autoUpdateStatusInDB = async () => {
  try {
    // Thay vì dùng ngày hiện tại, ta hard-code ngày test
    const currentDate = new Date('2025-05-07');
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

    const currentDateString = currentDate.toISOString().split("T")[0];

    const overdueTransactions = [];
    const waitingTransactions = [];
    let hasStatusChanges = false;

    console.log('Tổng số giao dịch:', transactions.length);
    
    transactions.forEach((trans) => {
      console.log('Transaction:', {
        id: trans.id,
        returnDate: trans.return_date,
        currentStatus: trans.status,
        shouldBeOverdue: trans.return_date < currentDateString
      });

      const shouldBeOverdue = trans.return_date < currentDateString;

      console.log('Date comparison:', {
        currentDate: currentDateString,
        returnDate: trans.return_date,
        isOverdue: shouldBeOverdue,
        currentStatus: trans.status
      });

      if (shouldBeOverdue && trans.status !== "Quá hạn") {
        overdueTransactions.push(trans.id);
        hasStatusChanges = true;
      } else if (!shouldBeOverdue && trans.status !== "Chờ trả") {
        waitingTransactions.push(trans.id);
        hasStatusChanges = true;
      }
    });

    if (hasStatusChanges) {
      if (overdueTransactions.length > 0) {
        await db.Transactions.update(
          { status: "Quá hạn" },
          {
            where: {
              id: overdueTransactions,
            },
          }
        );
      }

      if (waitingTransactions.length > 0) {
        await db.Transactions.update(
          { status: "Chờ trả" },
          {
            where: {
              id: waitingTransactions,
            },
          }
        );
      }

      let message = "";
      if (overdueTransactions.length > 0) {
        message = `Hệ thống vừa cập nhật ${overdueTransactions.length} giao dịch của sinh viên thành Quá hạn`;
      } else if (waitingTransactions.length > 0) {
        message = `Hệ thống vừa cập nhật ${waitingTransactions.length} giao dịch của sinh viên thành Chờ trả`;
      }
    }

    // Tách phần gửi email ra khỏi điều kiện hasStatusChanges
    // Gửi email cho tất cả các giao dịch phù hợp điều kiện
    for (const transaction of transactions) {
      const returnDate = new Date(transaction.return_date);
      const daysUntilReturn = Math.ceil((returnDate - currentDate) / (1000 * 60 * 60 * 24));
      
      // Gửi email khi:
      // - Còn 3 ngày hoặc ít hơn đến hạn
      // - Hoặc đã quá hạn
      if (daysUntilReturn <= 3 || daysUntilReturn <= 0) {
        console.log('Sending email for transaction:', transaction.id, 'Days until return:', daysUntilReturn);
        await sendEmailNotification(transaction, daysUntilReturn);
      }
    }

    return {
      EM: hasStatusChanges ? "Cập nhật trạng thái và gửi email thành công" : "Gửi email nhắc nhở thành công",
      EC: 0,
      DT: {
        updatedTransactions: transactions,
        emailsSent: true,
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

const checkAndSendEmailNotifications = async () => {
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

    for (const transaction of transactions) {
      const returnDate = new Date(transaction.return_date);
      const daysUntilReturn = Math.ceil((returnDate - currentDate) / (1000 * 60 * 60 * 24));
      
      let emailSubject = '';
      let emailContent = '';

      if (daysUntilReturn === 3) {
        emailSubject = "Nhắc nhở: Sắp đến hạn trả sách (còn 3 ngày)";
      } else if (daysUntilReturn === 2) {
        emailSubject = "Nhắc nhở: Sắp đến hạn trả sách (còn 2 ngày)";
      } else if (daysUntilReturn === 1) {
        emailSubject = "Cảnh báo: Ngày mai là hạn cuối trả sách";
      } else if (daysUntilReturn <= 0) {
        emailSubject = `Cảnh báo: Bạn đã quá hạn mượn sách ${Math.abs(daysUntilReturn)} ngày`;
      }

      if (emailSubject) {
        emailContent = `
          Kính gửi ${transaction.User.username},
          
          ${emailSubject} cho cuốn sách "${transaction.Book.title}".
          Ngày hẹn trả: ${transaction.return_date}
          
          Vui lòng trả sách đúng hạn để tránh và giảm thiểu các hình thức xử phạt.
          
          Trân trọng,
          Thư viện Đại Học Khoa Học Huế
        `;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: transaction.User.email,
          subject: emailSubject,
          text: emailContent
        });
      }
    }

    return {
      EM: "Đã gửi email nhắc nhở thành công",
      EC: 0,
      DT: []
    };
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    return {
      EM: "Lỗi trong quá trình gửi email",
      EC: 1,
      DT: []
    };
  }
};

module.exports = {
  autoUpdateStatusInDB,
  createTransactionService,
  checkAndSendEmailNotifications,
};
