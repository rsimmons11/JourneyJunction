// COMMENTS CONTROLLER

// This imports the Mongoose model for Comment from a file located in the "../models" directory, assuming that the model definition is in that file.
const Comment = require("../models/Comment");

// This exports an object that contains the controller functions defined in this module.
module.exports = {

  // This defines an asynchronous function named createComment that takes two parameters: req (the request object) and res (the response object), which are commonly used in Express.js route handlers.
  createComment: async (req, res) => {
    try {

      // This line initiates the creation of a new comment document in the MongoDB database using Mongoose's create method. It marks the beginning of the object literal passed to create.
      await Comment.create({
        // This sets the 'user' field of the comment to the user's unique identifier (often an ObjectId) obtained from the req.user.id. It associates the comment with the user who is creating it.
        user: req.user.id,
        // This sets the 'comment' field of the comment to the content of the comment, which is typically provided in the request body (req.body.comment).
        comment: req.body.comment,
        // This initializes the 'likes' field to 0. It's common to start with zero likes when creating a new comment, and this field can be incremented as users like the comment.
        likes: 0,
        // This sets the 'post' field to the ID of the post to which the comment is associated. The post ID is typically extracted from the route parameters (req.params.id).
        post: req.params.id,
      });
      console.log("Comment has been added!");
      res.redirect("/post/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  }
}