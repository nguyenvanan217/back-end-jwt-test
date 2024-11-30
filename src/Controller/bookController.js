import bookService from "../services/bookService";
const readFunc = async (req, res) => {
  try {
    let data = await bookService.getAllBook();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at get all book: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};

export default {
    readFunc,
};
