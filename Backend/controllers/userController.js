const User = require("../models/User");
const Post = require("../models/Post");

exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);
        if (!userToFollow) return res.status(400).json({ message: "User not Found" });

        if (currentUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);
        await currentUser.save();
        await userToFollow.save();

        return res.status(200).json({ message: "Successfully followed the user" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while following the user" });
    }
};

exports.unFollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToUnfollow) return res.status(400).json({ message: "User not found" });
        if (!currentUser) return res.status(400).json({ message: "Current user not found" });

        if (!currentUser.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        currentUser.following = currentUser.following.filter(
            userId => userId.toString() !== userToUnfollow._id.toString()
        );
        userToUnfollow.followers = userToUnfollow.followers.filter(
            userId => userId.toString() !== currentUser._id.toString()
        );

        await currentUser.save();
        await userToUnfollow.save();

        return res.json({ message: "Successfully unfollowed the user" });
    } catch (error) {
        console.error("Unfollow error:", error);
        return res.status(500).json({ message: "An error occurred during unfollowing" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.user._id;

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const posts = await Post.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("comments.user", "username")
            .populate("user", "username");

        return res.status(200).json({ user, posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.editProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const profileImage = req.file;

        const updateData = {};
        if (username) updateData.username = username;

        if (profileImage) {
            updateData.profilePicture = {
                url: profileImage.path,
                type: profileImage.mimetype.split("/")[0]
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update profile" });
    }
};