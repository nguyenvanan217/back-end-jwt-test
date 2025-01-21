import db from "../models";
import transactionService from "../services/transactionService";

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
      const { id, status, borrow_date, return_date } = transaction;

      const existingTransaction = await db.Transactions.findByPk(id);
      if (!existingTransaction) {
        return res.status(404).json({
          EM: `Transaction with id ${id} not found`,
          EC: 1,
          DT: [],
        });
      }

      if (
        existingTransaction.status !== status ||
        existingTransaction.borrow_date !== borrow_date ||
        existingTransaction.return_date !== return_date
      ) {
        await existingTransaction.update({
          status,
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

module.exports = {
  deleteTransaction,
  autoUpdateStatusInDB,
  updateDateAndStatus,
};
