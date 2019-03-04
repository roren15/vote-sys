'use strict'

const {config} = require('../../configs/config')
const User = require('../../models/user')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'login', config.log_view_level)
const commonUtils = require('../../utils/tools/commonUtils')
const Response = require('../../utils/wrapper/response')
const enums = require('../../configs/enums')
const util = require('util')
const uuid = require('node-uuid')

module.exports = async function (req, res) {

  const response = new Response()
  const req_query = req.query
  const req_body = req.body
  let res_data = {}
  const filter = {
    mail: req_body.mail,
    password: commonUtils.getMd5(req_body.password)
  }
  let login_update = {}

  if (!commonUtils.checkArgsNotNull(req_body.mail, req_body.password)) {
    return res.formatResponse('', enums.code.error.params, 'error params')
  }

  try {
    //todo: check if mail valid
    const userList = await User.doFind(filter)
    if (userList && userList.length > 0) {
      const user = userList[0]
      res_data['token'] = user.token
      res_data['userId'] = user._id
      res_data['role'] = user.role
      login_update = {
        lastLoginTime: Date.now(),
      }
      User.doUpdate(filter, login_update, false)
    } else {
      return res.formatResponse('', enums.code.error.login_failed, 'login fail')
    }
  } catch (err) {
    logger.exec(`response failed`, Logger.ERROR(), err)
    return res.formatResponse('', enums.code.error.apis_handle, `response failed: ${err.message}`)
  }

  response.setData(res_data)
  return res.formatSend(response.getResponse())
}