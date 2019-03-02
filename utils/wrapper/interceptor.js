const {config} = require('../../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'interceptor', config.log_view_level)
const utils = require('../tools/commonUtils')
const Enums = require('../../configs/enums')
const util = require('util')
const User = require('../../models/user')

/*
  white list for auth
 */
const AuthWhitelist = ['/', '/login', '/register', '/validate_mail']
const AuthWhiteMap=new Map([
  '/'
])

const AdminRoleList = ['/candidate']

class Interceptor {

  constructor(app, req, res) {
    this._app = app
    this._req = req
    this._res = res
  }

  /**
   * check if in white list
   * @returns {boolean}
   * @private
   */
  _isInList(path_list) {

    const split = this._req.url.split('?')
    const mainPath = split.length > 0 ? split[0] : split

    return path_list.indexOf(mainPath) !== -1
  }

  /**
   * basic auth check for request
   * @returns {Promise<*>}
   */
  async authFilter() {

    try {
      if (this._isInList(AuthWhitelist)) {
        return Promise.resolve()
      }

      const headers = this._req.headers
      const userId = headers[Enums.auth.AUTH_USER_ID]
      const role = headers[Enums.auth.AUTH_USER_ROLE]
      const token = headers[Enums.auth.AUTH_USER_TOKEN]

      if (!userId || !role || !token) {
        return Promise.reject(`err header params`)
      }
      const userList = await User.doFind({_id: userId})
      if (!(userList && userList.length > 0)) {
        return Promise.reject(`cannot find user`)
      }
      const user = userList[0]
      if (user.role !== role && user.token !== token) {
        return Promise.reject(`err role or token`)
      }
      if (this._isInList(AdminRoleList) && user.role !== Enums.user_role.admin) {
        return Promise.reject(`required for admin role`)
      }

    } catch (err) {
      logger.exec(`authFilter err`, Logger.ERROR(), err)
      return Promise.reject(err.message)
    }

    return Promise.resolve()
  }


}

module.exports = Interceptor
