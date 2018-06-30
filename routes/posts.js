const _ = require('lodash');
const auth = require('../middleware/auth');
const validate = require('../models/post').validate;
const Post = require('../models/post').Post;
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await Post.find()
    .populate('author')
    .populate('comments');
  res.send(posts);
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author')
    .populate('comments');
  if (!post) return res.status(404).send('Post with the given id was not found.');
  // success, so return the post
  return res.send(post);
});

router.post('/condition', async (req, res) => {
  const posts = await Post.find(req.body)
    .populate('author')
    .populate('comments');
  if (!posts.length) {
    return res.status(404).send(`Can't find any post under the given condition.`);
  }
  return res.send(posts);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error);

  let temp = _.pick(req.body, ['title', 'content']);
  temp.author = req.user._id;
  let post = new Post(temp);
  post = await post.save();

  res.send(post);
});

router.put('/:id', auth, async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send('Post with the given id was not found.');

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error);

  post.title = req.body.title;
  post.content = req.body.content;
  post = await post.save();

  res.send(post);
});

router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findByIdAndRemove(req.params.id);
  if (!post) return res.status(404).send('Post with the given id was not found.');
  // found, so return
  res.send(post);
});

module.exports = router;