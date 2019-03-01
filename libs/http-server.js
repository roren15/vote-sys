'use strict'

const http = require('http')
const https = require('https')

module.exports = app => {

  const Logger = require('js-standard-logger')
  const logger = new Logger(app.configs.config.log_save_dir, app.configs.config.log_save_file, 'http-server', app.configs.config.log_view_level)
  const hostname = app.configs.config.hostname
  const port = app.configs.config.port
  const https_port = app.configs.config.https_port

  // Create an HTTP service.
  app.httpServer = http.createServer(app).listen(port, hostname, () => {
    logger.exec(`Server has started at http:\/\/${hostname}:${port}`)
  })
  // Create an HTTPS service identical to the HTTP service.
  const fs = require('fs')
  // This line is from the Node.js HTTPS documentation.
  var options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
  }
  app.httpsServer = https.createServer(options, app).listen(https_port, hostname, () => {
    logger.exec(`Server has started at https:\/\/${hostname}:${https_port}`)
  })
}