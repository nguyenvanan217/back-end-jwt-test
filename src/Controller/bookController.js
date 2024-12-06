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
      EM: "Internal server error",
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
      EM: "Internal server error",
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
      EM: "Internal server error",
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
      EM: "Internal server error",
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
      EM: "Internal server error",
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
      EM: "Internal server error",
      EC: "-1",
      DT: "",
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
};
