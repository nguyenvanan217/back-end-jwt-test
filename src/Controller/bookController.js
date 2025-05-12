import bookService from "../services/bookService";
const readFunc = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) ||10;
    const search = req.query.search;

    // Luôn sử dụng phân trang, có hoặc không có search
    let data = await bookService.getAllBookPagination(page, limit, search);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: {
        books: data.DT.books,
        totalPages: data.DT.totalPages,
        totalRows: data.DT.totalRows,
        currentPage: page,
      },
    });
  } catch (error) {
    console.log("Error at get all book: ", error);
    return res.status(500).json({
      EM: "Lỗi máy chủ nội bộ",
      EC: "-1",
      DT: {
        books: [],
        totalPages: 0,
        totalRows: 0,
        currentPage: 1,
      },
    });
  }
};
const createBook = async (req, res) => {
  try {
    let data = req.body;
    let response = await bookService.createBook(data);
    console.log(response);
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (error) {
    console.log("Error at create book: ", error);
    return res.status(500).json({
      EM: "Lỗi máy chủ nội bộ",
      EC: "-1",
      DT: "",
    });
  }
};
const readGenre = async (req, res) => {
  try {
    let data = await bookService.getAllGenre();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at read genre: ", error);
    return res.status(500).json({
      EM: "Lỗi máy chủ nội bộ",
      EC: "-1",
      DT: "",
    });
  }
};
const deleteBook = async (req, res) => {
  try {
    let id = req.params.id;
    let response = await bookService.deleteBook(id);
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (error) {
    console.log("Error at delete book: ", error);
    return res.status(500).json({
      EM: "Lỗi máy chủ nội bộ",
      EC: "-1",
      DT: "",
    });
  }
};
const updateBook = async (req, res) => {
  try {
    let data = req.body;
    let id = req.params.id;
    let response = await bookService.updateBook(id, data);
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (error) {
    console.log("Error at update book: ", error);
    return res.status(500).json({
      EM: "Lỗi máy chủ nội bộ",
      EC: "-1",
      DT: "",
    });
  }
};
const addGenres = async (req, res) => {
  try {
    let data = await bookService.genresCreate(req.body.name);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("Error at add genres: ", error);
    return res.status(500).json({
      EM: "Lỗi máy chủ nội bộ",
      EC: "-1",
      DT: "",
    });
  }
};
const deleteGenre = async (req, res) => {
  try {
    let id = req.params.id;
    let response = await bookService.deleteGenreById(id);
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (error) {
    console.log("Error at delete genre: ", error);
    return res.status(500).json({
      EM: "Lỗi máy chủ nội bộ",
      EC: "-1",
      DT: "",
    });
  }
};
const importBooksFromExcel = async (req, res) => {
  try {
    // Kiểm tra file tồn tại
    if (!req.file) {
      return res.status(400).json({
        EM: "Không tìm thấy file",
        EC: 1,
        DT: []
      });
    }

    // Gọi service với buffer của file
    const result = await bookService.importBooksFromExcel(req.file.buffer);
    return res.status(200).json(result);

  } catch (error) {
    console.error("Import error:", error);
    return res.status(500).json({
      EM: error.message || "Lỗi server",
      EC: -1,
      DT: []
    });
  }
};

export default {
  readFunc,
  createBook,
  readGenre,
  updateBook,
  deleteBook,
  addGenres,
  deleteGenre,
  importBooksFromExcel
};
