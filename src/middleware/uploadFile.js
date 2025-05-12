import multer from 'multer';

// Cấu hình multer cho Excel
const excelUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes('excel') || 
            file.mimetype.includes('spreadsheet') ||
            /\.(xlsx|xls)$/.test(file.originalname.toLowerCase())) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}).single('file'); // Định nghĩa middleware với tên field 'file'

export const uploadExcel = (req, res, next) => {
    excelUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                EM: `Lỗi upload: ${err.message}`,
                EC: 1,
                DT: []
            });
        } else if (err) {
            return res.status(400).json({
                EM: err.message,
                EC: 1,
                DT: []
            });
        }
        next();
    });
};