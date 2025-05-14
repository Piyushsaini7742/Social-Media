const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const allowedFormats = [
    'image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml',
    'image/gif', 'video/mp4', 'application/pdf', 'audio/mpeg'
];

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "socialmedia/uploads",
        resource_type: "auto",
        allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'gif', 'mp4', 'pdf', 'mp3']
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedFormats.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported File Type"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
