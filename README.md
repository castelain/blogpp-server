# A powerful tool for content providers

Blog++'s backend is powered by Express.js and MongoDB.

## Implementation of CRUD

> This server is Restful.

- Posts

  ```json
  {
      "_id": "Post ObjectId",
      "author": "User ObjectId ",
      "title": "title string",
      "content": "content string"
  }
  ```

  When creating a new post on the server, the request is passed to the "auth" middleware, then make the current user the author of the new post.
- Users

  ```json
  {
      "_id": "User ObjectId",
      "name": "name string",
      "email": "email string"
  }
  ```
