const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  const post = await Post.create({
    content: req.body.content,
    user: req.user.id
  });

  res.send(post);
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find().populate('user');
  res.send(posts);
};