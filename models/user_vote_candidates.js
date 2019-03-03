'use strict'

const {config} = require('../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'user_vote_candidates', config.log_view_level)
const commonUtils = require('../utils/tools/commonUtils')
const mongoose = require('mongoose')
const dbHelper = require('../utils/helper/dbHelper')

/**
 * schema
 */
const the_schema = new mongoose.Schema({
      // 用户
      userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
      // 投票
      voteId: {type: mongoose.Schema.Types.ObjectId, ref: 'Vote', required: true},
      // 候选人
      candidateIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Candidate'}],
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
    User_vote_candidates.findOneAndUpdate(
        {_id: res._id},
        ip,
        err => {
          if (err) {
            logger.exec(`append ip for user_vote_candidates err: ${Logger.stringify(err.message)}`, Logger.DEBUG())
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
      User_vote_candidates.create(options)
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

  if (commonUtils.checkArgsNotNull(filter, update)) {
    return new Promise((resolve, reject) => {
      User_vote_candidates.update(filter, update, {multi: multi}, async function (err, mongoRes) {
        if (err) {
          return reject(await logger.exceptionThrows(`update throw err: ${err.message}`))
        }
        logger.exec(`update successfully with filter: ${Logger.stringify(filter)}`, Logger.DEBUG())
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
    User_vote_candidates.find(options, async function (err, docs) {
      if (err) {
        return reject(await logger.exceptionThrows(`find throw err: ${err.message}`))
      }
      if (!docs) {
        reject(await logger.exec(`no found`, Logger.WARN()))
      }
      logger.exec(`find successfully`, Logger.DEBUG())
      resolve(docs)
    })
  })
}

const User_vote_candidates = mongoose.model('User_vote_candidates', the_schema)
module.exports = User_vote_candidates