'use strict'

const {config} = require('../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'candidate_vote_users', config.log_view_level)
const commonUtils = require('../utils/tools/commonUtils')
const mongoose = require('mongoose')
const dbHelper = require('../utils/helper/dbHelper')

/**
 * schema
 */
const the_schema = new mongoose.Schema({
      // 候选人
      candidateId: {type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true},
      // 投票
      voteId: {type: mongoose.Schema.Types.ObjectId, ref: 'Vote', required: true},
      // 用户
      userIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
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
    Candidate_vote_users.findOneAndUpdate(
        {_id: res._id},
        ip,
        err => {
          if (err) {
            logger.exec(`append ip for candidate_vote_users err: ${Logger.stringify(err.message)}`, Logger.DEBUG())
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
      Candidate_vote_users.create(options)
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
      Candidate_vote_users.update(filter, update, {multi: multi}, async function (err, mongoRes) {
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
    Candidate_vote_users.find(options, async function (err, docs) {
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

const Candidate_vote_users = mongoose.model('Candidate_vote_users', the_schema)
module.exports = Candidate_vote_users