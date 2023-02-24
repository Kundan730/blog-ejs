const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config();
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 3000;

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.set("strictQuery", false);

const password = process.env.PASS;

mongoose
  .connect(
    `mongodb+srv://Kundan7:${password}@cluster0.sk1g6fg.mongodb.net/blogsDB`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  post: { type: String, required: true },
});

const Post = mongoose.model("post", postSchema);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// let posts = [];

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { about: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contact: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  // const post = {
  //   title: req.body.title,
  //   post: req.body.post,
  // };
  // posts.push(post);

  const newPost = new Post({
    title: req.body.title,
    post: req.body.post,
  });

  newPost.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });

  // res.redirect("/");
  // res.render('post', {title: post.title, post: post.post});
});

app.get("/posts/:postId", (req, res) => {
  const value = req.params.postId;

  Post.findOne({ _id: value }, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      res.render("post", { title: post.title, post: post.post });
    }
  });
  // const requestedTitle = _.lowerCase(value);
  // post.forEach(function (post) {
  //   let storedTitle = _.lowerCase(post.title);
  //   if (storedTitle === requestedTitle) {
  //     console.log("Match found!");
  //     res.render("post", { title: post.title, post: post.post });
  //   }
  // });
});

app.listen(port, function () {
  console.log(`App listening at http://localhost:${port}`);
});
