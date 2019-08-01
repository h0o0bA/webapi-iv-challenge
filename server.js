const express = require("express");
const server = express();
const helmet = require("helmet");
const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

server.use(express.json());
server.use(helmet());
server.use(logger);

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Web API IV - Deployment Challenge !</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const time = new Date();
  console.log(
    `${req.method} request. ${req.url} request URL. ${time} a timestamp`
  );
  next();
}

module.exports = server;
