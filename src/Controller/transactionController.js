import db from "../models";
const updateStatus = async (req, res) => {
  try {
    const transactions = req.body;
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        EM: "Invalid data format",
        EC: 1,
        DT: [],
      });
    }

    let nothingToUpdate = true;

   
    for (const transaction of transactions) {
      if (!transaction.id || !transaction.status) {
        return res.status(400).json({
          EM: "Missing id or status for a transaction",
          EC: 1,
          DT: [],
        });
      }

     
      const existingTransaction = await db.Transactions.findOne({
        where: { id: transaction.id },
        attributes: ["status"],
      });

      if (!existingTransaction) {
        return res.status(404).json({
          EM: `Transaction with id ${transaction.id} not found`,
          EC: 1,
          DT: [],
        });
      }

     
      if (existingTransaction.status !== transaction.status) {
        nothingToUpdate = false;
        await db.Transactions.update(
          { status: transaction.status },
          { where: { id: transaction.id } }
        );
      }
    }

   
    if (nothingToUpdate) {
      return res.status(200).json({
        EM: "Nothing to update",
        EC: 2,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Update status successfully",
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
module.exports = {
  updateStatus,
  deleteTransaction,
};
