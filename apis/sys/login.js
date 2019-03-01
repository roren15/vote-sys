'use strict'

const {config} = require('../../configs/config')
const User = require('../../models/user')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'login', config.log_view_level)
const commonUtils = require('../../utils/tools/commonUtils')
const Response = require('../../utils/wrapper/response')
const Enums = require('../../configs/enums')
const util = require('util')
const uuid = require('node-uuid')


module.exports = async function (req, res) {

  let response = new Response()

  return res.formatSend(response.getResponse())
}