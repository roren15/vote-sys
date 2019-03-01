'use strict'

const {config} = require('../../configs/config')
const User = require('../../models/user')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'login', config.log_view_level)
const commonUtils = require('../../utils/tools/commonUtils')
const Response = require('../../utils/wrapper/response')
const util = require('util')
const uuid = require('node-uuid')

module.exports = async function (req, res) {

  const response = new Response()

  let params = req.body

  let options = {
    username: params.username,
    password: commonUtils.getMd5(params.password),
    role: params.role,
    portrait: params.portrait,
    score: 0,
    token: '',
    lastLoginTime: null,
    ip: commonUtils.getIpFromExpressReq(req),
    isDelete: false
  }

  let queryOptions = {
    username: options.username
  }

  let userList = await User.findUser(queryOptions)
  if (!userList || userList.length === 0) {
    await User.doCreate(options)
    let userList = await User.findUser(queryOptions)
    console.log('create user -> ' + util.inspect(userList))
    response.setData(userList[0])
    return res.formatSend(response.getResponse())
  }

  let user = userList[0]
  response.setData(user)
  return res.formatSend(response.getResponse())
}