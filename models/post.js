const Joi = require('joi');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  comments: {
    type: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Comment'
    }]
  }
});

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
  const schema = {
    title: Joi.string().required(),
    content: Joi.string().required(),
  };

  return Joi.validate(post, schema);
}

exports.Post = Post;
exports.validate = validatePost;