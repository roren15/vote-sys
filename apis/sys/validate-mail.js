'use strict'

const {config} = require('../../configs/config')
const User = require('../../models/user')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'validate-mail', config.log_view_level)
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

  if (!commonUtils.checkArgsNotNull(req_query.mail, req_query.validate_code)) {
    return res.formatResponse('', enums.code.error.params, 'error params')
  }

  try {
    const user_filter = {
      mail: req_query.mail,
    }
    const userList = await User.doFind(user_filter)
    if (userList && userList.length > 0) {
      const user = userList[0]
      if (user.mail_valid_code === req_query.validate_code) {
        const token = uuid.v1()
        await User.doUpdate(user_filter, {
          token: token
        }, false)
        res_data['token'] = token
        res_data['userId'] = user._id
        res_data['role'] = user.role
      } else {
        return res.formatResponse('', enums.code.error.email_validate_code_invalid, 'please input valid email validate code')
      }
    } else {
      return res.formatResponse('', enums.code.error.email_invalid, 'please input valid email address')
    }
  } catch (err) {
    logger.exec(`response failed`, Logger.ERROR(), err)
    return res.formatResponse('', enums.code.error.apis_handle, `response failed: ${err.message}`)
  }

  response.setData(res_data)
  return res.formatSend(response.getResponse())
}