'use strict'

const {config} = require('../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'user', config.log_view_level)
const commonUtils = require('../utils/tools/commonUtils')
const mongoose = require('mongoose')
const dbHelper = require('../utils/helper/dbHelper')
const enums = require('../configs/enums')

/**
 * 用户信息
 */
const the_schema = new mongoose.Schema({
      // 邮箱
      mail: {
        type: String, required: true,
      },
      // 用户名
      username: {
        type: String, required: false, default: ''
      },
      // 密码
      password: {
        type: String, required: true, default: ''
      },
      // 角色（USER | ADMIN）
      role: {
        type: String, required: true, default: enums.user_role.user,
      },
      // 投票场
      voteId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Vote', required: false
      },
      // 候选人
      candidateIds: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: false
      }],
      // 邮箱是否合格
      //todo: each request required to check mail's validation
      mail_valid: {
        type: Boolean, required: false, default: false,
      },
      // 邮箱验证码
      mail_valid_code: {
        type: String, required: false, default: '',
      },
      // 登录Token
      token: {
        type: String, required: false, default: ''
      },
      // 最后登录时间
      lastLoginTime: {
        type: Date, required: false
      },
      // ip
      ips: {
        type: Array, required: false,
      },
      // 删除与否
      isDelete: {
        type: Boolean, default: false
      },
    },
    {
      timestamps: true
    }
)

const appendIp = function (options) {

  if (!options || !options['ip']) return
  return {
    $push: {
      ips: options['ip']
    }
  }
}

const updateIp = async function (res, options) {

  const ip = appendIp(options)
  if (commonUtils.judgeNotNull(ip)) {
    User.findOneAndUpdate(
        {_id: res._id},
        ip,
        err => {
          if (err) {
            logger.exec(`append ip for user err: ${Logger.stringify(err.message)}`, Logger.DEBUG())
          }
        }
    )
  }
}

/**
 * 创建用户
 * @param options
 * @returns {Promise<void>}
 */
the_schema.statics.doCreate = async function (options) {

  commonUtils.cleanFields(options)

  if (commonUtils.checkArgsNotNull(options)) {
    return new Promise((resolve, reject) => {
      User.create(options)
          .then(res => {
            updateIp(res, options)
            logger.exec(`save successfully with options: ${Logger.stringify(options)}`, Logger.DEBUG())
            return resolve(res)
          })
          .catch(async err => {
            return reject(await logger.exceptionThrows(`save throw err: ${err.message}`))
          })
    })
  }
}

/**
 * 更新用户信息
 * @param filter_param 过滤参数
 * @param update
 * @param multi
 * @returns {Promise<void>}
 */
the_schema.statics.doUpdate = async function (filter_param, update, multi = true) {

  let filter = commonUtils.cloneDeepObject(filter_param)
  Object.assign(update, appendIp(update))
  commonUtils.cleanFields(filter)
  commonUtils.cleanFields(update)
  dbHelper.filterBasics(filter)
  //todo: check for _id field

  if (commonUtils.checkArgsNotNull(filter, update)) {
    return new Promise((resolve, reject) => {
      User.update(filter, update, {multi: multi}, async function (err, mongoRes) {
        if (err) {
          //todo: how to catch if not use await
          return reject(await logger.exceptionThrows(`update throw err: ${err.message}`))
        }
        logger.exec(`update  ${Logger.stringify(filter)} successfully for filter: ${Logger.stringify(filter)}`, Logger.DEBUG())
        return resolve(mongoRes)
      })
    })
  }
}

/**
 * 查询用户
 * @param options
 */
the_schema.statics.doFind = function (options) {

  commonUtils.cleanFields(options)
  dbHelper.filterBasics(options)

  return new Promise((resolve, reject) => {
    User.find(options, async function (err, docs) {
      if (err) {
        return reject(await logger.exceptionThrows(`find throw err: ${err.message}`))
      }
      if (commonUtils.judgeNotNull(docs)) {
        logger.exec(`find successfully`, Logger.DEBUG())
      }
      resolve(docs)
    })
  })
}

const User = mongoose.model('User', the_schema)
module.exports = User

const createUserManually = async function (username, password = '123456') {
  try {
    const userList = await User.findUser({username: username})
    if (!userList || userList.length === 0) {
      let option = {
        username: username,
        password: commonUtils.getMd5(password),
        role: 'USER',
        portrait: "http://thirdwx.qlogo.cn/mmopen/oQMWFaoAOicibtg7bVOPRth98JicZJ2ib2SahELXcpWsaqQ4rZ8yibNia4kOx28sibz9SC54FA0heTKXjTvdd80U7M2UeAABSXVDPhu/132",
        score: 0,
        token: '',
        lastLoginTime: null,
        isDelete: false
      }
      await User.doCreate(option)
      logger.exec(`createUserManually successfully`)
    }
  } catch (err) {
    logger.exec(`createUserManually err`, Logger.ERROR(), err)
  }
}

{
  /**
   * create some account if not found
   */
  // createUserManually('test001')
}
