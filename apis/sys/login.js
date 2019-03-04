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
const projUtils = require('../../utils/tools/projUtils')

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
    const userList = await User.doFind(filter)
    if (commonUtils.judgeNotNull(userList)) {
      const user = userList[0]
      if (user.mail_valid) {
        res_data['token'] = user.token
        res_data['userId'] = user._id
        res_data['role'] = user.role
      } else {
        const mail_valid_code = projUtils.validate_mail(user.mail)
        login_update['mail_valid_code'] = mail_valid_code
        response.setCode(enums.code.error.email_need_to_validate)
      }
      login_update['lastLoginTime'] = Date.now()
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