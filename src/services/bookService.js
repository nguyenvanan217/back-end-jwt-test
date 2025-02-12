import db from "../models";
import { Op } from "sequelize";
const getAllBookPagination = async (page, limit, searchTerm = "") => {
  try {
    let offset = (page - 1) * limit;

    // Tạo điều kiện tìm kiếm
    let whereCondition = {};
    if (searchTerm) {
      whereCondition = {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { author: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    const { rows: books, count } = await db.Book.findAndCountAll({
      where: whereCondition,
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
      order: [["id", "DESC"]],
      limit: limit,
      offset: offset,
    });

    return {
      EM: "Lấy danh sách sách thành công",
      EC: 0,
      DT: {
        books: books,
        totalRows: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrong width service !",
      EC: 1,
      DT: {
        books: [],
        totalRows: 0,
        totalPages: 0,
        currentPage: 1,
      },
    };
  }
};

const createBook = async (data) => {
  try {
    console.log(data);
    let genre = await db.Genres.findOne({ where: { name: data.genre_name } });
    if (!genre) {
      return {
        EM: "Không tìm thấy thể loại!",
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
      EM: "Thêm sách mới thành công",
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
        EM: "Lấy tất cả thể loại thành công",
        EC: 0,
        DT: genres,
      };
    } else {
      return {
        EM: "Không tìm thấy thể loại",
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
        EM: "Xóa sách thành công",
        EC: 0,
        DT: book,
      };
    } else {
      return {
        EM: "Không tìm thấy sách",
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
          attributes: ["name"],
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
      "genreId",
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
        EM: "Không có thay đổi nào",
        EC: 1,
        DT: [],
      };
    }

    // Thực hiện cập nhật
    await db.Book.update(data, {
      where: { id },
    });

    return {
      EM: "Cập nhật sách thành công",
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
const genresCreate = async (data) => {
  try {
    let genres = await db.Genres.findOne({
      where: {
        name: data,
      },
    });
    if (genres) {
      return {
        EM: "This genre already exists",
        EC: "1",
      };
    }
    await db.Genres.create({
      name: data,
    });
    return {
      EM: "Create genre successfully",
      EC: "0",
    };
  } catch (error) {
    console.log("Error at add genres: ", error);
    return res.status(500).json({
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    });
  }
};
const deleteGenreById = async (id) => {
  try {
    let check = await db.Genres.findOne({ where: { id } });
    if (check) {
      await db.Genres.destroy({ where: { id } });
      return {
        EM: "Delete genre successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Genre not found",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log("Error at delete genre: ", error);
    return {
      EM: "Internal server error",
      EC: "-1",
      DT: "",
    };
  }
};
module.exports = {
  createBook,
  getAllGenre,
  deleteBook,
  updateBook,
  genresCreate,
  deleteGenreById,
  getAllBookPagination,
};
