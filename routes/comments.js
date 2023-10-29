//COMMENTS ROUTE

// This line imports the Express.js framework into the module, making it available for use.
const express = require("express");
// This creates a new router object using the express.Router() method. Routers are used to define and group routes for specific parts of an application.
const router = express.Router();
// This line imports a module called commentsController, which likely contains the controller functions for handling comment-related operations.
const commentsController = require("../controllers/comments");
// This line imports two middleware functions, ensureAuth and ensureGuest, from a module located at "../middleware/auth". These middleware functions are typically used for user authentication and access control.
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comment Routes - simplified for now

// This line defines a POST route for creating a comment. When a POST request is made to a URL that matches "/createComment/:id," the commentsController.createComment function will be invoked. The :id part in the URL is a route parameter that can be accessed within the controller function.
router.post("/createComment/:id", commentsController.createComment);

// This exports the router object, making it available for use in other parts of the application.
module.exports = router;