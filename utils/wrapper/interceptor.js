const {config} = require('../../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'interceptor', config.log_view_level)
const utils = require('../tools/commonUtils')
const Enums = require('../../configs/enums')
const util = require('util')
const User = require('../../models/user')

const whitelist = ['/', '/login', '/register', '/validate_mail']

class Interceptor {

  constructor(app, req, res) {
    this._app = app
    this._req = req
    this._res = res
  }

  _isInWhitelist() {

    const split = this._req.url.split('?')
    const mainPath = split.length > 0 ? split[0] : split

    return whitelist.indexOf(mainPath) !== -1
  }

  async _authCheck() {

    if (this._isInWhitelist()) return true

    let headers = this._req.headers
    logger.exec('headers -> ' + util.inspect(headers))

    let userId = headers[Enums.auth.AUTH_USER_ID]
    let role = headers[Enums.auth.AUTH_USER_ROLE]
    let token = headers[Enums.auth.AUTH_USER_TOKEN]

    if (!userId || !role || !token) {
      return false
    }

    let userList = await User.doFind({_id: userId})
    if (!userList || userList.length === 0) {
      return false
    }

    let user = userList[0]
    if (!user) return false

    if (user.role !== role && user.token !== token) return false

    return true
  }
}

module.exports = Interceptor
