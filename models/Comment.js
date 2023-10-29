//COMMENTS SCHEMA

const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  // This defines a field named comment within the schema, which stores the text content of the comment. It is of type String and is required, meaning a comment document must have this field.
  comment: {
    type: String,
    required: true,
  },
  // This defines a field named likes for storing the number of likes a comment has received. It is of type Number and is required.
  likes: {
    type: Number,
    required: true,
  },
  // This field named post is used to store the reference (ObjectId) to the post to which the comment is associated. The ref option specifies that this field references the "Post" model.
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  // This field named 'user' stores the reference (ObjectId) to the user who created the comment. It references the "User" model. This is another way to associate a comment with a user using their unique identifier.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // This field named 'createdAt' stores the timestamp when the comment was created. It is of type Date and has a default value of the current timestamp.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
