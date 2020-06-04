const express = require('express');

const morgan = require('morgan')

const server = express();

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')

server.use(morgan('combined'))
server.use(express.json())

server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {}

module.exports = server;
