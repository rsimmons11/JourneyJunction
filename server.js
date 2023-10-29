const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

// This line loads environment variables from a ".env" file located in the "config" directory using the 'dotenv' package. It allows you to access environment-specific configuration settings.
require("dotenv").config({ path: "./config/.env" });

// This line imports and configures Passport.js for handling user authentication. It likely sets up passport strategies and middleware for authentication.
require("./config/passport")(passport);

// This line calls a function named 'connectDB()' to establish a connection to the database. The actual implementation of this function likely involves connecting to a MongoDB database using Mongoose.
connectDB();

// This sets the view engine for rendering templates to EJS (Embedded JavaScript). It means that EJS templates will be used for rendering views.
app.set("view engine", "ejs");

// This serves static files from the "public" directory, making them accessible on the web. These static files can include stylesheets, JavaScript, images, and other client-side assets.
app.use(express.static("public"));

//Body Parsing
// This middleware parses URL-encoded form data from HTTP requests. It makes the form data available in 'req.body' for use in route handlers.
app.use(express.urlencoded({ extended: true }));
// This middleware parses JSON data from HTTP requests. It parses the JSON request body and makes it available in 'req.body'.
app.use(express.json());

//Logging
// This uses the "morgan" middleware to log HTTP request information to the console. The "dev" format is a predefined log format that provides concise but informative log output.
app.use(logger("dev"));

// This middleware allows HTTP methods like PUT and DELETE to be used in forms by spoofing them using a query parameter called "_method." It's often used when HTML forms don't support these HTTP methods directly.
app.use(methodOverride("_method"));

// This configures and uses the 'express-session' middleware for managing user sessions. It provides settings such as a secret key, session storage in MongoDB (using 'MongoStore'), and other session-related options.
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
// This line sets up a middleware for the root URL path ("/"). It tells Express to use the route handlers defined in the 'mainRoutes' object when a request is made to the root URL. This can be used for defining routes like the homepage.
app.use("/", mainRoutes);
// This line sets up a middleware for the "/post" URL path. It tells Express to use the route handlers defined in the 'postRoutes' object when a request is made to a URL that starts with "/post". This is often used for routes related to posts.
app.use("/post", postRoutes);
// This line sets up a middleware for the "/comment" URL path. It tells Express to use the route handlers defined in the commentRoutes object when a request is made to a URL that starts with "/comment". This is typically used for routes related to comments.
app.use("/comment", commentRoutes);

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
