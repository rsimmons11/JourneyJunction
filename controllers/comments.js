// COMMENTS CONTROLLER

const Comment = require("../models/Comment");

module.exports = {

  createComment: async (req, res) => {
    try {

      // Create a new comment and associate it with the user
      await Comment.create({
        user: req.user.id,
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
      });
      console.log("Comment has been added!");
      res.redirect("/post/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  }
}