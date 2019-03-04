const commonUtils = require('./commonUtils')
const {config} = require('../../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'projUtils', config.log_view_level)
const fs = require('fs-extra')
const Enums = require('../../configs/enums')
const path = require('path')
const _ = require('lodash')
const util = require('util')
const url = require('url')

module.exports = {

  validate_mail(mail) {

    const uuid = require('node-uuid')
    const sendmail = require('sendmail')()

    const mail_valid_code = uuid.v1()
    const validate_mail_url = url.resolve((`${config.self_domain}validate_mail`), `?mail=${mail}`, `&validate_code=${mail_valid_code}`)
    sendmail({
      from: config.mail_send_address,
      to: mail,
      subject: `${validate_mail_url}`,
      html: 'Mail of Activation',
    }, function (err, reply) {

    })
    return mail_valid_code
  }
}