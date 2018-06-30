const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const validate = require('../models/user').validate;
const User = require('../models/user').User;
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// get the current user
router.get('/me', auth, async (req, res) => {
  console.log(req.user);
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).send('Can not find the user with the given id.');
  }
  res.send(user);
});

router.get('/:email', async (req, res) => {
  const user = await User.find({ email: req.params.email });
  if (user) {
    res.status(400).send('Email already registered.');
  }
  return res.send(true);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password', 'bio']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;