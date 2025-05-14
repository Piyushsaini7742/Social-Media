const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const { createPost, likePost, unlikePost, addComment, getFeed } = require("../controllers/postController");

router.post('/', authMiddleware, upload.single('media'), createPost);
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/unlike', authMiddleware, unlikePost);
router.post('/:id/comment', authMiddleware, addComment);
router.get('/feed', authMiddleware, getFeed);

module.exports = router;