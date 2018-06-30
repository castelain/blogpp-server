const Joi = require('joi');
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: mongoose.SchemaTypes.String,
    minlength: 5,
    maxlength: 255
  },
  parent_post: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Post',
    default: null
  },
  parent_comment: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Comment',
    default: null
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  sub_comments: {
    type: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Comment'
    }]
  }
});

const Comment = mongoose.model('Comment', commentSchema);

exports.Comment = Comment;