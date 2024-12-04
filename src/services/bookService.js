import db from "../models";
const getAllBook = async () => {
  try {
    let books = await db.Book.findAll({
      attributes: [
        "id",
        "title",
        "author",
        "quantity",
        "cover_image",
        "genreId",
      ],
      include: [
        {
          model: db.Genres,
          attributes: ["name"],
        },
      ],
    });
    if (books) {
      return {
        EM: "Get all book successfully",
        EC: 0,
        DT: books,
      };
    } else {
      return {
        EM: "Book not found",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrong width service !",
      EC: 1,
      DT: [],
    };
  }
};

const createBook = async (data) => {
  try {
    console.log(data);
    let book = await db.Book.create({
      title: data.title,
      author: data.author,
      quantity: data.quantity,
      cover_image: data.cover_image,
      genreId: data.genreId,
    });
    return {
      EM: "Create book successfully",
      EC: 0,
      DT: book,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrong width service !",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = { getAllBook, createBook };
