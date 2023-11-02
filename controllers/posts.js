//POST CONTROLLER

const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      // This line uses Mongoose to find a 'post' document in the MongoDB database by its unique identifier (req.params.id). The result is stored in the 'post' variable. This assumes there's a Mongoose model named Post.
      const post = await Post.findById(req.params.id);
      console.log('Post:', post);
      // This code retrieves comments associated with the post. It uses the Mongoose Comment model to find comments where the 'post' field matches the post's unique identifier. The .sort({ createdAt: "desc" }) sorts the comments in descending order by their creation timestamp. The .populate('user') is used to populate the 'user' field in each comment with the associated user information. The .lean() method is used to convert the results into plain JavaScript objects, which can be more efficient for rendering in templates.
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).populate('user', 'userName').lean();
      // This line renders a template file named "post.ejs" (presumably an EJS template). It passes the post (the post document), user (the user making the request), and comments (the array of comments) as variables to be used within the template for rendering.
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        // This sets the 'title' field of the post to the value obtained from the request body (req.body.title). It typically represents the title or heading of the post.
        title: req.body.title,
        // This sets the 'image' field of the post to the secure URL of the image. It is obtained from the 'result' object, which likely contains the image URL after uploading the image to a service like Cloudinary.
        image: result.secure_url,
        // This sets the 'cloudinaryId' field of the post to the public ID of the uploaded image. It is also obtained from the 'result' object and may be used for reference or deletion of the image from the image hosting service (e.g., Cloudinary).
        cloudinaryId: result.public_id,
        // This sets the 'caption' field of the post to the value obtained from the request body (req.body.caption). It typically represents additional text or a description associated with the post.
        caption: req.body.caption,
        // This initializes the 'likes' field to 0. It's common to start with zero likes when creating a new post, and this field can be incremented as users like the post.
        likes: 0,
        // This sets the 'user' field to the user's unique identifier (often an ObjectId) obtained from 'req.user.id'. It associates the post with the user who is creating it.
        user: req.user.id,
        userName: req.user.userName,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      // This line uses Mongoose's 'findOneAndUpdate' method to update a post document. It specifies the search criteria as { _id: req.params.id }, which means it is looking for the post with the unique identifier provided in the 'req.params.id'.
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          // This part of the update specifies that the 'likes' field in the post document should be incremented by 1. The '$inc' operator is used to increment the value of a field.
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      // This line redirects the user to the page of the post that was liked. It constructs the URL based on the post's unique identifier extracted from the route parameters (req.params.id).
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // This line uses Mongoose to find a post document in the MongoDB database by its unique identifier (req.params.id). The found post document is then stored in the 'post' variable.
      let post = await Post.findById({ _id: req.params.id });
      // This code uses Cloudinary's 'uploader.destroy' method to delete the image associated with the post. The 'post.cloudinaryId' is used as the public ID of the image to be removed. Cloudinary identifies and deletes the image with this public ID.
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // This line uses Mongoose to remove the post document from the MongoDB database. The criteria for removal is based on the post's unique identifier, which is extracted from the route parameters (req.params.id).
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },

  // New controller method to update 'post' documents with usernames
  updatePostsWithUsernames: async (req, res) => {
    try {
      console.log("updatePosts route accessed");

      // Fetch all 'post' documents
      const posts = await Post.find({});

      // Iterate through the posts and update the 'userName' field
      for (const post of posts) {
        const user = await User.findById(post.user);
        if (user) {
          post.userName = user.userName;
          await post.save();
        }
      }

      console.log("Posts updated with usernames.");
      res.redirect("/"); // Redirect to a suitable location after the update.
    } catch (err) {
      console.error(err);
    }
  },  

};
