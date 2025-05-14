const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const { followUser, unFollowUser, getProfile, editProfile } = require("../controllers/userController");

router.post('/:id/follow', authMiddleware, followUser);
router.post('/:id/unfollow', authMiddleware, unFollowUser);
router.get("/profile/:id", authMiddleware, getProfile);
router.put("/edit", authMiddleware, upload.single("profilePicture"), editProfile);

module.exports = router;