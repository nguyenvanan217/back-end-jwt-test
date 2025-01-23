import db from "../models/index";

const autoUpdateStatusInDB = async () => {
  try {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0];

    const transactions = await db.Transactions.findAll({
      where: {
        status: {
          [db.Sequelize.Op.in]: ["Chờ trả", "Quá hạn"],
        },
      },
    });

    const overdueTransactions = [];
    const waitingTransactions = [];
    let hasStatusChanges = false; //true

    transactions.forEach((trans) => {
      const shouldBeOverdue = trans.return_date < currentDateString; //true

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

      return {
        EM: message,
        EC: 0,
        DT: {
          overdueTransactions,
          waitingTransactions,
          hasChanges: true,
        },
      };
    }

    return {
      EM: "",
      EC: 0,
      DT: {
        overdueTransactions: [],
        waitingTransactions: [],
        hasChanges: false,
      },
    };
  } catch (error) {
    console.log("Error at auto update Status:", error);
    return {
      EM: "Internal server error",
      EC: -1,
      DT: "",
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

module.exports = {
  autoUpdateStatusInDB,
  createTransactionService,
};
