const config = require('config');
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const posts = require('./routes/posts');
const cors = require('./middleware/cors');
const ueditor = require('ueditor');
const path = require('path');
const express = require('express');
const app = express();

if (!config.get('jwt_key')) {
  console.log('FATAL ERROR: jwt_key is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/blogpp')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
// set CORS keys
app.use(cors);

// set routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/posts', posts);

// PORT
const port = process.env.BLOGPP_PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
