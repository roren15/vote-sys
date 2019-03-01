'use strict'

const {config} = require('../../configs/config')
const User = require('../../models/user')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'login', config.log_view_level)
const commonUtils = require('../../utils/tools/commonUtils')
const Response = require('../../utils/wrapper/response')
const Enums = require('../../configs/enums')
const util = require('util')
const uuid = require('node-uuid')


module.exports = async function (req, res) {

  let params = req.body
  let options = {
    username: params.username,
    password: commonUtils.getMd5(params.password),
  }

  let userList = await User.findUser(options)
  if (!userList || userList.length === 0) {
    return res.formatSend(new Response({}, Enums.code.error.params, '用户不存在或者密码错误').getResponse())
  }

  let user = userList[0]

  console.log('user -> ' + util.inspect(user))

  // 生成登录TOKEN
  let token = uuid.v1()

  // ************** 更新用户token **************
  let where = {
    _id: user._id
  }
  let update = {
    token: token,
    lastLoginTime: Date.now(),
  }
  const ip = commonUtils.getIpFromExpressReq(req)
  if (user.ips.indexOf(ip) === -1) {
    update['ip'] = ip
  }
  User.doUpdate(where, update, false)

  // ************** 获取已分配的任务列表 **************
  let missionList = await Mission.find({userId: user._id})
  console.log('missionList -> ' + util.inspect(missionList))

  let missions = []
  for (let i = 0 i < missionList.length i++) {
    let item = missionList[i]
    let voice = await Voice.findOneVoice({_id: item.voiceId})
    missions.push({
      voiceId: voice._id,
      mediaId: voice.mediaId,
      name: voice.name,
      finish: item.finish
    })
  }

  let response = new Response({
    userId: user._id,
    username: user.username,
    role: user.role,
    portrait: user.portrait ? user.portrait : '',
    token: token,
    score: user.score,
    missions: missions
  })

  return res.formatSend(response.getResponse())
}