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
  res.status(200).json({
    challenge: "Web API IV - Deployment Challenge !",
    messageOfTheDay: process.env.MOTD
  });
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
