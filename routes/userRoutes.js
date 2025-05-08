const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { followUser, unFollowUser } = require("../controllers/userController");

router.post('/:id/follow', authMiddleware, followUser);
router.post('/:id/unfollow', authMiddleware, unFollowUser);

module.exports = router;