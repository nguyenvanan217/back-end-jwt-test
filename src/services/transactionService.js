import db from "../models/index";

const autoUpdateStatusInDB = async () => {
  try {
    // Lấy ngày hiện tại và format thành YYYY-MM-DD
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0];
    console.log("Current date:", currentDateString);

    // Tìm tất cả giao dịch chưa trả
    const transactions = await db.Transactions.findAll({
      where: {
        status: {
          [db.Sequelize.Op.ne]: "Đã trả",
        },
      },
    });

    console.log("Found transactions to check:", transactions.length);

    // Phân loại và kiểm tra thay đổi
    const overdueTransactions = [];
    const waitingTransactions = [];
    let hasStatusChanges = false;

    transactions.forEach((trans) => {
      const shouldBeOverdue = trans.return_date < currentDateString;

      // Kiểm tra nếu cần thay đổi status
      if (shouldBeOverdue && trans.status !== "Quá hạn") {
        overdueTransactions.push(trans.id);
        hasStatusChanges = true;
      } else if (!shouldBeOverdue && trans.status !== "Chờ trả") {
        waitingTransactions.push(trans.id);
        hasStatusChanges = true;
      }

      console.log(
        `Transaction ID: ${trans.id}, Return date: ${trans.return_date}, Current status: ${trans.status}, Should be overdue: ${shouldBeOverdue}`
      );
    });

    // Chỉ cập nhật nếu có thay đổi
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

    // Trả về response không có thay đổi
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

module.exports = {
  autoUpdateStatusInDB,
};
