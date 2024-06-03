require('dotenv').config()
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())  // compress data from serer-client, reduce bandwidth
app.use(express.json()) // express v4 không cần phải cài body-parser nữa vì nó hỗ trợ urlencoded và json
app.use(express.urlencoded({ extended: true }))

// init db
require('./dbs/init.mongodb')
  // const { checkOverload } = require('./helper/check.connect')
  // checkOverload()

// init routes
app.use('/', require('./routes/index'))

// handling error
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
  })
})

module.exports = app;