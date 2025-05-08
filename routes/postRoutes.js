const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const { createPost } = require("../controllers/postController");

router.post('/', authMiddleware, upload.single('media'), createPost);

module.exports = router;