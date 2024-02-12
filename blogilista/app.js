const config = require('./utils/config')
const logger = require('./utils/logger')
const http = require('http')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter=require('./controllers/blogs')
const usersRouter= require('./controllers/users')
const loginRouter=require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')


//const mongoUrl = config.MONGODB_URI
//kun laittaa url iin mongodb.net/ jälkeen uuden nimeen niin atlas luo autom. uuden tietokannan mongodb.net/noteApp?
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app