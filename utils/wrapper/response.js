const Enums = require('../../configs/enums')
const commonUtils = require('../tools/commonUtils')
const JSON = require('circular-json')
const {config} = require('../../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'response', config.log_view_level)

class Response {

  constructor(data = {}, code = Enums.code.success.default, message = '') {

    this._res_obj = {
      code: code,
      data: data,
      message: message
    }
  }

  getResponse() {
    return this._res_obj
  }

  setCode(code) {

    if (!commonUtils.judgeNotNull(code)) return
    const oldCode = this._res_obj.code
    if (commonUtils.judgeNotNull(oldCode) && oldCode !== Enums.code.success.default) return
    this._res_obj['code'] = code
  }

  setData(data) {

    if (!commonUtils.judgeNotNull(data)) return
    if (commonUtils.judgeNotNull(data) && commonUtils.judgeNotNull(this._res_obj['data'])) logger.exec(`old data will be covered`, Logger.WARN())
    this._res_obj['data'] = data
  }

  appendData(data) {

    if (commonUtils.getType(this._res_obj['data']) !== 'array') this._res_obj['data'] = []
    this._res_obj['data'].push(data)
  }

  appendMessage(message) {

    if (!message) return
    if (commonUtils.isObj(message) || commonUtils.isArray(message)) {
      message = JSON.stringify(message)
    }
    this._res_obj['message'] += message + ' . '
  }
}

module.exports = Response