const multer = require('multer');
const path = require('path');

// Set storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.filename + '-' + Date.now() + path.extname(file.originalname)
        );
    }
});

// upload
const upload = multer({
    storage,
    limits: {fileSize: 100000000000000},
    fileFilter(req, file, cb) {
        checkFileTypes(file, cb);
    }
});

// check file types
function checkFileTypes(file, cb) {
    const filetypes = /jpeg|jpg|png|svg|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only image (jpeg, jpg, png, svg) are allowed'));
    };
};

module.exports = upload;