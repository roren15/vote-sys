'use strict'

const {config} = require('../../configs/config')
const User = require('../../models/user')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'login', config.log_view_level)
const commonUtils = require('../../utils/tools/commonUtils')
const Response = require('../../utils/wrapper/response')
const util = require('util')
const enums = require('../../configs/enums')
const uuid = require('node-uuid')

module.exports = async function (req, res) {

  const response = new Response()
  const req_query = req.query
  const req_body = req.body
  let res_data = {}

  if (!commonUtils.checkArgsNotNull(req_body.mail)) {
    return res.formatResponse('', enums.code.error.params, 'error params')
  }

  try {
    if (!commonUtils.validateEmail(req_body.mail)) {
      return res.formatResponse('', enums.code.error.email_invalid, 'please input valid email address')
    }
    const token = uuid.v1()
    res_data['token'] = token
    let register_option = {
      mail: req_body.mail,
      role: req_body.role || enums.user_role.user,
      username: req_body.username || '',
      token: token,
      ip: commonUtils.getIpFromExpressReq(req),
      isDelete: false
    }
    const register_filter = {
      mail: req_body.mail,
    }
    let userList = await User.doFind(register_filter)
    if (userList && userList.length > 0) {
      return res.formatResponse('', enums.code.error.email_used, 'email address has been used')
    } else {
      const register_user = await User.doCreate(register_option)
      logger.exec(`register with mail: ${req_body.mail}`)
      response.setData(res_data)
    }
  } catch (err) {
    logger.exec(`response failed`, Logger.ERROR(), err)
    return res.formatResponse('', enums.code.error.apis_handle, `response failed: ${err.message}`)
  }

  return res.formatSend(response.getResponse())
}