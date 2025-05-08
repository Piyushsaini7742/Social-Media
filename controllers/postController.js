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