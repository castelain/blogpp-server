const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: 5,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },
  bio: {
    type: String
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({
    _id: this._id,
    name: this.name
  }, config.get('jwt_key'), { expiresIn: '1d' });
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    bio: Joi.string()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;