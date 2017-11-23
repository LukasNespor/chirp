var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var Post = mongoose.model("Post");

router.route("/posts")
  .get((req, res) => {
    Post.find().sort([["created", "descending"]]).exec((err, data) => {
      if (err) return res.status(500).send(err);
      return res.json(data);
    });
  })
  .post((req, res) => {
    var post = new Post();
    post.text = req.body.text;
    post.author = req.body.author;
    post.save((err, post) => {
      if (err) return res.status(500).send(err);
      return res.json(post);
    });
  });

router.route("/posts/:id")
  .delete((req, res) => {
    Post.findByIdAndRemove(req.params.id, (err, post) => {
      res.json(post);
    });
  });

module.exports = router;
