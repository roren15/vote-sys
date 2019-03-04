const {config} = require('../../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'commonUtil', config.log_view_level)
const _ = require('lodash')
const fs = require('fs-extra')
const crypto = require('crypto')
const https = require('https')
const http = require('http')
const util = require('util')

module.exports = {

  getType(obj) {
    //tostring会返回对应不同的标签的构造函数
    var toString = Object.prototype.toString;
    var map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object AsyncFunction]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    };
    var val = toString.call(obj)
    return map[val];
  },

  isMethod(method) {
    return method && typeof method === 'function'
  },

  isArray(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Array]'
  },

  isObj(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]'
  },

  /**
   * 是对象就判断对象是否为非空对象
   * @param obj
   * @returns {boolean}
   */
  objectNotEmpty(obj) {

    if (this.isObj(obj)) {
      for (let key in obj) {
        return true
      }
      return false
    } else {
      return true
    }
  },

  /**
   * 是数组就判断是否为空,否则返回true
   * @param array
   * @returns {boolean}
   */
  arrayNotEmpty(array) {

    if (this.isArray(array)) {
      return array.length > 0
    } else {
      return true
    }
  },

  /**
   * 非空(有东西)判断 ps:为空情况：空字符串'',空数组[],空对象{},undefined,null,NaN
   * @param val
   * @returns {*|boolean}
   */
  judgeNotNull(val) {
    return (val || val === 0 || val === false) && this.objectNotEmpty(val) && this.arrayNotEmpty(val)
  },

  /**
   * jsonify parameter, if string given, return it back, or will return object
   * @param resString
   * @returns {String|Object}
   */
  jsonifyRes(resString) {

    let res
    resString = resString.replace(/NaN/g, '\"NaN\"')
    resString = resString.replace(/null/g, '\"null\"')
    try {
      res = JSON.parse(resString)
    } catch (err) {
      return resString
    }
    return res
  },

  generateRandomNum(num = 10) {

    // 方法1
    let res = 0
    for (let i = 1; i <= num; i++) {
      res += Math.round(Math.random() * num) * Math.pow(num, i);
    }
    return res
    // 方法2
    // return Math.random().toString().slice(-num)
  },

  generateTimestampRandom(splitDirPathFlag = '-') {
    return new Date().getTime() + splitDirPathFlag + this.generateRandomNum(6)
  },

  getIpFromExpressReq(req) {
    return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
  },

  getTimeString() {
    return new Date().toLocaleString()
  },

  checkString(string, command, long_remain) {

    let res = true
    res = res && (string.indexOf(command) !== -1)
    if (this.judgeNotNull(long_remain)) {
      res = res && ((string.length - command.length) < long_remain)
    }
    return res
  },

  getRoundNum(num, fix_num = 2) {

    return (Math.round(num * 100) / 100).toFixed(fix_num);
  },

  /**
   * ensure dir splitting last former "/" path
   * @param dirPath
   */
  ensurePathExists(dirPath) {

    try {
      if (!dirPath) logger.exceptionThrows(`null params`)
      let splitDirPath = dirPath.split('/')
      if (splitDirPath.length > 1) {
        splitDirPath.pop()
        splitDirPath = splitDirPath.join('/')
      }
      if (!fs.pathExistsSync(splitDirPath)) {
        fs.mkdirpSync(splitDirPath)
      }
    } catch (err) {
      logger.exceptionThrows(`ensurePathExists throw err: ${err.message}`)
    }
  },

  _timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  async sleepSync(_timeout, fn, ...args) {

    await this._timeout(_timeout)
    return fn(...args)
  },

  async sleepAsync(_timeout, fn, fn_then, fn_catch, ...args) {

    await this._timeout(_timeout)
    fn(...args)
        .then(res => {
          fn_then(res)
        })
        .catch(err => {
          fn_catch(err)
        })
  },

  invoke(fn, ...args) {
    return fn(...args)
  },

  getTimestamp() {
    return new Date().getTime()
  },

  /**
   * clean fields for object
   * @param obj
   * @return
   */
  cleanFields(obj) {

    if (!(this.judgeNotNull(obj) && this.isObj(obj))) {
      return obj
    }
    for (let key in obj) {
      if (this.getType(obj[key]) === 'object') {
        this.cleanFields(obj[key])
      }
      if (!this.judgeNotNull(obj[key])) {
        delete obj[key]
      }
    }
    return obj
  },

  /**
   * ensure args not null
   * @param args
   * @returns {boolean}
   */
  checkArgsNotNull(...args) {

    let res = true
    args.forEach(val => {
      if (!this.judgeNotNull(val)) {
        logger.exec(`null detect for ${Logger.stringify(args)}`, Logger.WARN())
        res = false
        return false
      }
    })
    return res
  },

  /**
   * ensure obj keeping method
   * @param model
   * @param method_name
   * @returns {boolean}
   */
  checkObjMethod(model, method_name) {

    let test = false
    test = this.judgeNotNull(model) && model[method_name] && this.isMethod(model[method_name])
    if (!test) {
      logger.exec(`checkObjMethod for method: ${method_name} failed`, Logger.WARN())
    }
    return test
  },

  cloneDeepObject(obj) {
    return this.judgeNotNull(obj) ? _.cloneDeep(obj) : {}
  },

  getMd5(obj) {
    return crypto.createHash('md5').update(obj).digest('hex')
  },

  /**
   * fetch url resource from get method
   * @param fetch_media_file_url: http_request url
   * @param options: http_request options
   * @param res_options
   * @returns {Promise<Object>}
   */
  async getHttpFile(fetch_media_file_url, options = {}, res_options = {}) {

    const that = this
    return new Promise(async (resolve, reject) => {

      if (!fetch_media_file_url) {
        return reject(await logger.exec(`err input`, Logger.ERROR()))
      }
      logger.exec(`getHttpFile with options -> ${util.inspect(options)}`)
      const enums = require('../../configs/enums')
      const http_request = fetch_media_file_url.indexOf('https') !== -1 ? https : http
      const resType = res_options && res_options['type'] ? res_options['type'] : enums.response_type.buffer
      const resCode = res_options && res_options['code'] ? res_options['code'] : enums.response_code.default

      try {
        let res
        let res_data
        http_request.get(fetch_media_file_url, options, function (response) {
          switch (resType) {
            case enums.response_type.json:
              res = ''
              response.on('data', (chunk) => {
                res += chunk
              })
              break
            case enums.response_type.buffer:
            default:
              res = []
              response.on('data', (chunk) => {
                res.push(chunk)
              })
              break
          }
          response.on('end', async () => {
            if (!res) {
              return reject(await logger.exec(`fetch null from url: ${fetch_media_file_url}`, Logger.ERROR()))
            }
            const name = that.fetchNameFromUrl(fetch_media_file_url)
            switch (resType) {
              case enums.response_type.json:
                res_data = JSON.parse(res)
                if (res_data[resCode] !== enums.code.success.default) {
                  return reject(await logger.exec(`err response code: ${res_data[resCode]} from url: ${fetch_media_file_url}`, Logger.ERROR()))
                }
                break
              case enums.response_type.buffer:
              default:
                res_data = Buffer.concat(res)
                break
            }
            logger.exec(`fetch successfully from url: ${fetch_media_file_url}`)
            return resolve({
              name: name,
              data: res_data,
            })
          })
        }).on('error', async (err) => {
          return reject(await logger.exec(`err request from url: ${fetch_media_file_url}`, Logger.ERROR()), err)
        })
      } catch (err) {
        return reject(await logger.exec(`decode error : ${err}`, Logger.ERROR()))
      }
    })
  },

  /**
   * fetch name from url
   * @param fetch_media_file_url
   * @returns {T | undefined}
   */
  fetchNameFromUrl(fetch_media_file_url) {

    if (fetch_media_file_url) {
      const splitUrl = fetch_media_file_url.split('/')
      const name = splitUrl.pop()
      return name
    }
  },

  validateEmail(email) {

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return email && re.test(String(email).toLowerCase())
  },

  send_mail_validate(mail_address,validate_code){


  }
}
