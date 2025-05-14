const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    const { content } = req.body;
    const mediaFile = req.file;

    try {
        const newPost = new Post({
            user: req.user._id,
            content
        });

        if (mediaFile) {
            newPost.media = {
                url: mediaFile.path,
                type: mediaFile.mimetype.split('/')[0]
            };
        }

        await newPost.save();
        return res.status(201).json({ message: "Post created successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while creating the post." });
    }
};

exports.likePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post Not Found" });
        if (post.likes.includes(req.user._id)) {
            return res.status(400).json({ message: "You already liked the post" })
        }
        post.likes.push(req.user._id);
        await post.save();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

exports.unlikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(400).json({ message: "Post Not Found" });
        post.likes = post.likes.filter((userId) => userId.toString() !== req.user._id.toString());
        await post.save();

        return res.status(200).json({ message: "Post unliked Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.addComment = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const post = await Post.findById(id);
        if (!post) return res.status(400).json({ message: "Post Not Found" });
        const comment = {
            user: req.user._id,
            text
        }
        post.comments.push(comment);
        await post.save();
        return res.status(201).json({ message: "Comment Added Successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

exports.getFeed = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const following = req.user.following;
        const self = req.user._id;
        const posts = await Post.find({
            user: { $in: [self, ...following] }
        })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('user', 'username email')
            .populate('comments.user', 'username email');

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred during Feed Loading. Please wait..." });
    }
}