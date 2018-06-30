const Comment = require('../models/comment').Comment;
const Post = require('../models/post').Post;
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const comments = await Comment.find()
    .populate('author')
    .populate('parent_post')
    .populate('parent_comment')
    .populate('sub_comments');
  res.send(comments);
});

router.get('/:id', async (req, res) => {
  let comment = await Comment.findById(req.params.id)
    .populate('author')
    .populate('parent_post')
    .populate('parent_comment')
    .populate('sub_comments');
  if (!comment) return res.status(404).send('Comment with the given id was not found.');
  // found, so return
  res.send(comment);
});

// get under certain condition
router.post('/condition', async (req, res) => {
  const comments = await Comment.find(req.body)
    .populate('author')
    .populate('parent_post')
    .populate('parent_comment')
    .populate('sub_comments');
  if (!comments.length) {
    return res.status(404).send("Can't find any comments under the given condition.");
  }
  return res.send(comments);
});

router.post('/', auth, async (req, res) => {
  let body = req.body;
  body.author = req.user._id;

  let comment = new Comment(body);
  comment = await comment.save();

  let post = await Post.findById(body.parent_post);
  post.comments.push(comment._id);
  await post.save();

  res.send(comment);
});

// create sub-comment
router.post('/sub', auth, async (req, res) => {
  let body = req.body;
  body.author = req.user._id;
  let comment = new Comment(body);
  comment = await comment.save();
  parentComment = await Comment.findById(body.parent_comment);
  parentComment.sub_comments.push(comment._id);
  await parentComment.save();
  res.send(comment);
});

router.put('/:id', auth, async (req, res) => {
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).send('Comment with the given id was not found.')
  }
  comment.content = req.body.content;
  comment = await comment.save();
  res.send(comment);
});

router.delete('/:id', auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).send('Comment with the given id was not found.')
  }
  const parent_post = await Post.findById(comment.parent_post);
  if (parent_post) {
    parent_post.comments.remove(comment._id);
    await parent_post.save();
  }

  const parent_comment = await Comment.findById(comment.parent_comment);
  if (parent_comment) {
    parent_comment.sub_comments.remove(comment._id);
    await parent_comment.save();
  }

  await comment.remove();

  return res.send(comment);
});

module.exports = router;