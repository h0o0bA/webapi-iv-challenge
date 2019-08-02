const express = require("express");
const postsDB = require("./postDb.js");

const router = express.Router();

router.get("/", (req, res) => {
  postsDB.get().then(posts => {
    res.status(200).json(posts);
  });
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  postsDB
    .remove(req.params.id)
    .then(removed => {
      res.status(200).json({ message: "The post has has been removed" });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.put("/:id", validatePostId, validatePostBody, (req, res) => {
  postsDB
    .update(req.params.id, req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// custom middleware

function validatePostId(req, res, next) {
  postsDB
    .getById(req.params.id)
    .then(post => {
      console.log(post); // { id: 9, text: 'Well, that rules you out.', user_id: 3 }
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(404).json({ message: "Id not found" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

function validatePostBody(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
