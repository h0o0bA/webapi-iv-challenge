const express = require("express");
const usersDb = require("./userDb.js");
const postsDb = require("../posts/postDb.js");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  usersDb
    .insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };
  postsDb
    .insert(postInfo)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/", (req, res) => {
  usersDb
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/:id", validateUserId, (req, res) => {
  //  console.log('in get: ', req.user); // { id: 6, name: 'Boromir' }
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  usersDb
    .getUserPosts(req.params.id)
    .then(userPosts => {
      if (userPosts.length > 0) {
        res.status(200).json(userPosts);
      } else {
        res
          .status(404)
          .json({ message: "there are no any posts for the specified id" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  usersDb
    .remove(req.params.id)
    .then(user => {
      res.status(200).json({ message: "The user has been deleted" });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  usersDb
    .update(req.params.id, req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//custom middleware

function validateUserId(req, res, next) {
  usersDb
    .getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        // console.log(req.user); // { id: 6, name: 'Boromir' }
        next();
      } else {
        res.status(404).json({ message: "Id not found" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

function validateUser(req, res, next) {
  console.log(Object.keys(req.body));
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing user data." });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length <= 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
