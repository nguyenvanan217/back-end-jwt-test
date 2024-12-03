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

    // Lặp qua từng transaction để cập nhật trạng thái
    for (const transaction of transactions) {
      if (!transaction.id || !transaction.status) {
        return res.status(400).json({
          EM: "Missing id or status for a transaction",
          EC: 1,
          DT: [],
        });
      }

      await db.Transactions.update(
        { status: transaction.status },
        { where: { id: transaction.id } }
      );
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

module.exports = {
  updateStatus,
};
