const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./data/dbConfig.js');

const projectsRouter = require('./routers/projects');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

server.use('/api/projects', projectsRouter);

server.get('/', (req, res) => {
  res.send('We Working!');
});

module.exports = server;
