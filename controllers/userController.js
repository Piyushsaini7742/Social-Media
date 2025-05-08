const User = require("../models/User");

exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);
        if (!userToFollow) return res.status(400).json({ message: "User not Found" });

        if (currentUser.following.includes(userToFollow._id)) return res.status(400).json({ message: "You are already Follwing this User" });

        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);
        await currentUser.save();
        await userToFollow.save();
        return res.status(200).json({ message: "Badhai ho aapne ek user ko follow kiya hai" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An Unknown Error Occured in Catch Block" });
    }
}

exports.unFollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user?._id);

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

        return res.json({ message: "You have unfollowed a user" });
    } catch (error) {
        console.error("Unfollow error:", error);
        return res.status(500).json({ message: "An error occurred during unfollowing a user" });
    }
};
