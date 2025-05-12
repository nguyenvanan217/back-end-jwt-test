import db from "../models";
import { Op } from "sequelize";
const xlsx = require('xlsx');

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
    // Xóa tất cả giao dịch liên quan trước
    await db.Transactions.destroy({ where: { bookId: id } });

    // Sau đó xóa sách
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
      EM: "Lỗi trong quá trình xử lý",
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

const validateBookData = (row, index) => {
  const errors = [];
  const requiredFields = {
    title: 'Tên sách',
    author: 'Tác giả', 
    genre_name: 'Thể loại',
    quantity: 'Số lượng'
  };

  // Validate dữ liệu
  for (const [field, fieldName] of Object.entries(requiredFields)) {
    if (!row[field]) {
      errors.push(`Thiếu thông tin ${fieldName}`);
    }
  }

  // Validate số lượng
  if (row.quantity) {
    if (isNaN(row.quantity)) {
      errors.push('Số lượng phải là số');
    } else if (row.quantity <= 0) {
      errors.push('Số lượng phải lớn hơn 0');
    }
  }

  return {
    rowIndex: index + 1,
    bookTitle: row.title || 'Không có tên',
    hasError: errors.length > 0,
    errors: errors,
    rawData: row
  };
};

const importBooksFromExcel = async (fileBuffer) => {
  try {
    const workbook = xlsx.read(fileBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Validate tất cả dữ liệu
    const validationResults = data.map((row, index) => validateBookData(row, index));
    const hasErrors = validationResults.some(result => result.hasError);

    // Nếu có lỗi, trả về chi tiết lỗi
    if (hasErrors) {
      return {
        EM: "Dữ liệu Excel không hợp lệ",
        EC: 1,
        DT: {
          totalRows: data.length,
          validRows: validationResults.filter(r => !r.hasError).length,
          errorRows: validationResults.filter(r => r.hasError).length,
          details: validationResults.map(result => ({
            row: result.rowIndex,
            title: result.bookTitle,
            isValid: !result.hasError,
            errors: result.errors
          }))
        }
      };
    }

    // Nếu dữ liệu hợp lệ, tiến hành import
    const importResults = [];
    const successBooks = [];
    
    for (const row of data) {
      try {
        // Kiểm tra/tạo genre
        let genre = await db.Genres.findOne({
          where: { name: row.genre_name }
        });

        if (!genre) {
          genre = await db.Genres.create({
            name: row.genre_name
          });
        }

        // Kiểm tra sách tồn tại
        const existingBook = await db.Book.findOne({
          where: {
            title: row.title,
            author: row.author
          }
        });

        if (existingBook) {
          await existingBook.update({
            quantity: existingBook.quantity + parseInt(row.quantity)
          });
          successBooks.push({
            ...existingBook.get(),
            status: 'updated',
            addedQuantity: parseInt(row.quantity)
          });
        } else {
          const newBook = await db.Book.create({
            title: row.title,
            author: row.author,
            quantity: parseInt(row.quantity),
            cover_image: row.cover_image || null,
            genreId: genre.id
          });
          successBooks.push({
            ...newBook.get(),
            status: 'created'
          });
        }

      } catch (err) {
        importResults.push({
          title: row.title,
          success: false,
          error: err.message
        });
      }
    }

    return {
      EM: `Import thành công ${successBooks.length}/${data.length} sách`,
      EC: 0,
      DT: {
        totalProcessed: data.length,
        successCount: successBooks.length,
        books: successBooks.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          quantity: book.quantity,
          status: book.status,
          addedQuantity: book.addedQuantity
        }))
      }
    };

  } catch (error) {
    console.error("Error importing books:", error);
    return {
      EM: "Lỗi khi import dữ liệu",
      EC: -1,
      DT: {
        error: error.message
      }
    };
  }
};

const handleImportExcel = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  // Đảm bảo tên field là 'file' khớp với backend
  formData.append('file', file);

  try {
    const response = await importBooksFromExcel(formData);
    setImportResult(response);
    setIsOpenModalImport(true);

    if (response.EC === 0) {
      await fetchAllBook();
    }
  } catch (error) {
    console.error('Import error:', error);
    toast.error('Lỗi khi import file Excel');
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
  importBooksFromExcel,
  handleImportExcel
};
