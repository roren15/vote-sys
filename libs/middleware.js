'use strict'

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const {config} = require('../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'middleware', config.log_view_level)
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const Response = require('../utils/wrapper/response')
const Interceptor = require('../utils/wrapper/interceptor')
const commonUtils = require('../utils/tools/commonUtils')
const Enums = require('../configs/enums');

//format Response
express.response.formatResponse = function (data, code, message) {

  const res = new Response(data, code, message)
  const response = res.getResponse()
  logger.exec(`handle for url: ${this.req.url}, response : ${Logger.stringify(response)}`)
  return this.send(response)
}

//format send
express.response.formatSend = function (body) {

  logger.exec(`handle for ${this.req.url}, response : ${Logger.stringify(body)}`)
  return this.send(body)
}

//middleware
module.exports = app => {

  app.use(morgan(`:method :url :status :res[content-length] :response-time ms :remote-addr`, {
    stream: {
      write: (message) => {
        logger.exec(Logger.stringify(message))
      }
    }
  }))
  app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
  }))
  app.set('trust proxy', true)
  app.use(bodyParser.json()) // for parsing application/json
  app.use(fileUpload())
  app.use(async (req, res, next) => {
    const interceptor = new Interceptor(app, req, res);
    if (!await interceptor._authCheck()) {
      res.json({
        code: Enums.code.error.params,
        message: "登录失效"
      });
      return;
    }
    next()
  })
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
  app.use(compression())
  app.use(helmet())
  app.use(express.static("public"))
}
