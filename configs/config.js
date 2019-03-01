'use strict'

const enums = require('../configs/enums')
const Logger = require('js-standard-logger')

const COMMON_CONFIG = {

  hostname: '0.0.0.0',
  port: '23333',
  https_port: '23334',

  mongodb: '',
  mongo_reconnect_timeout: 30 * 1000,//30s重連

  log_save_dir: '/data/logs/vote-sys/',
  log_save_file: 'vote-sys.log',
  log_view_level: global.appEnv === enums.env.prod ? Logger.INFO() : Logger.DEBUG(),

  root_save_path: '/data/vote-sys/',

  mail_send_address: '152393288@qq.com',
}

const genConfig = function () {

  switch (global.appEnv) {
    case enums.env.prod:
      return Object.assign(COMMON_CONFIG, require("./config.production.js"))
    case enums.env.test:
      return Object.assign(COMMON_CONFIG, require("./config.test.js"), require("./config.local.js"))
    case enums.env.dev:
      return Object.assign(COMMON_CONFIG, require("./config.development.js"), require("./config.local.js"))
    default:
      return COMMON_CONFIG
  }
}

module.exports = () => {
  return genConfig()
}

module.exports.config = genConfig()