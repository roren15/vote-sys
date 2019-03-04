'use strict'

const {config} = require('../../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'user-handler', config.log_view_level)
const User = require('../../models/user')
const commonUtils = require('../../utils/tools/commonUtils')
const Response = require('../../utils/wrapper/response')
const enums = require('../../configs/enums')
const util = require('util')
const projUtils = require('../../utils/tools/projUtils')

module.exports = async function (req, res) {

  const response = new Response()
  const req_method = req.method
  const req_query = req.query
  const req_body = req.body
  let res_data = {}
  let filter = {
    _id: req_body.id || req_query.id
  }
  let user_update = {}

  try {
    switch (req_method) {
      case enums.request_method.get:

        break
      case enums.request_method.put:
        if (!commonUtils.checkArgsNotNull(req_body.id)) {
          return res.formatResponse('', enums.code.error.params, 'error params')
        }
        /*
          not support for role or vote update
         */
        /*
          re validate mail
         */
        if (req_body.mail) {
          const mail_valid_code = projUtils.validate_mail(req_body.mail)
          user_update['mail'] = req_body.mail
          user_update['mail_valid_code'] = req_body.mail_valid_code
        }
        user_update['name'] = req_body.username
        user_update['mail'] = req_body.mail
        User.doUpdate(filter, user_update, false)
        break
    }
  } catch (err) {
    logger.exec(`response failed`, Logger.ERROR(), err)
    return res.formatResponse('', enums.code.error.apis_handle, `response failed: ${err.message}`)
  }

  response.setData(res_data)
  return res.formatSend(response.getResponse())
}