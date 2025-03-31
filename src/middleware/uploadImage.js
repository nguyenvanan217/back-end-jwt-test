import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Sử dụng đường dẫn tuyệt đối
const uploadDir = path.join(__dirname, '..', 'uploads');
try {
    if (!fs.existsSync(uploadDir)) {
       fs.mkdirSync(uploadDir, { recursive: true });
    }
 } catch (err) {
    console.error("error at uploads:", err);
 }

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadDir);// Nơi lưu file
   },
   filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + path.basename(file.originalname);
      cb(null, uniqueName); // Tên file được tạo từ timestamp và tên gốc
   },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
     const filetypes = /jpeg|jpg|png|webp/;  // Thêm webp vào đây
     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
     const mimetype = filetypes.test(file.mimetype);
     if (extname && mimetype) {
        return cb(null, true);
     } else {
        cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, webp)!')); // Cập nhật thông báo
     }
  },
});
export { upload };
