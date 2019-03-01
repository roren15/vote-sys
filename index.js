'use strict'

require('./global')
const {config} = require('./configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'index', config.log_view_level)
const express = require('express')
const consign = require('consign')
const app = express()

try {
  const commonConsign = consign({verbose: true})
      .include('configs/config.js')
      .then('libs/db.js')
      .then('libs/middleware.js')
      .then('libs/http-server.js')
      .then('routes')
  commonConsign.into(app)
  logger.exec(`${global.appEnv} application start, on path: ${global.appRoot}`)
} catch (err) {
  logger.exec(`${global.appEnv} application failed to start, on path: ${global.appRoot} , force exit now`, Logger.ERROR(), err)
  process.exit(1)
}

module.exports = app