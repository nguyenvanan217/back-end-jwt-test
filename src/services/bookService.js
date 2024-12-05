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
    let genre = await db.Genres.findOne({ where: { name: data.genre_name } });
    if (!genre) {
      return {
        EM: "Genre not found!",
        EC: 1,
        DT: [],
      };
    }
    let book = await db.Book.create({
      title: data.title,
      author: data.author,
      quantity: data.quantity,
      cover_image: data.cover_image,
      genreId: genre.id,
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

const getAllGenre = async () => {
  try {
    let genres = await db.Genres.findAll();
    if (genres) {
      return {
        EM: "Get all genre successfully",
        EC: 0,
        DT: genres,
      };
    } else {
      return {
        EM: "Genre not found",
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

const deleteBook = async (id) => {
  try {
    let book = await db.Book.destroy({ where: { id } });
    if (book) {
      return {
        EM: "Delete book successfully",
        EC: 0,
        DT: book,
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
const updateBook = async (id, data) => {
  try {
    // Lấy dữ liệu hiện tại của sách từ DB
    let currentBook = await db.Book.findOne({
      where: { id },
      include: [
        {
          model: db.Genres,
          attributes: ['name']
        },
      ],
    });

    if (!currentBook) {
      return {
        EM: "Book not found",
        EC: 1,
        DT: [],
      };
    }

    // Tìm genre_id dựa trên genre_name
    if (data.genre_name) {
      const genre = await db.Genres.findOne({
        where: { name: data.genre_name },
      });

      if (genre) {
        data.genreId = genre.id;
      }
    }
    delete data.genre_name;

    // So sánh dữ liệu cũ và mới
    let hasChanges = false;
    const comparableFields = [
      "title",
      "author",
      "quantity",
      "cover_image",
      "genreId"
    ];

    for (const field of comparableFields) {
      if (
        data[field] !== undefined &&
        String(data[field]) !== String(currentBook[field])
      ) {
        hasChanges = true;
        break;
      }
    }

    if (!hasChanges) {
      return {
        EM: "Nothing to update",
        EC: 1,
        DT: [],
      };
    }

    // Thực hiện cập nhật
    await db.Book.update(data, {
      where: { id },
    });

    return {
      EM: "Update book successfully",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong with service!",
      EC: -1,
      DT: [],
    };
  }
};
module.exports = {
  getAllBook,
  createBook,
  getAllGenre,
  deleteBook,
  updateBook,
};
