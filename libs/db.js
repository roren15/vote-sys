'use strict'

module.exports = app => {

  const path = require('path')
  const mongoose = require('mongoose')
  const {config} = require('../configs/config')
  const dbURL = config.mongodb
  const Logger = require('js-standard-logger')
  const logger = new Logger(config.log_save_dir, config.log_save_file, 'db', config.log_view_level)
  mongoose.Promise = global.Promise

  const connectSucc = function () {
    logger.exec(`Successfully connected to the database: ${dbURL}`)
  }

  const connectErrorCatch = function (err) {
    //超时重连
    logger.exec(`Could not connect to the database: ${dbURL} , but still process . try reconnect in ${config.mongo_reconnect_timeout}s . error: ${err.message}`, Logger.WARN())
    setTimeout(() => {
      connectWithRetry()
    }, config.mongo_reconnect_timeout)
    // process.exit()
  }

  const connectWithRetry = function () {
    mongoose.connect(dbURL, {useNewUrlParser: true})
        .then(() => {
          connectSucc()
        })
        .catch(err => {
          connectErrorCatch(err)
        })
  }

  connectWithRetry()
}
