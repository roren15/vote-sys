'use strict'

const {config} = require('../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'vote', config.log_view_level)
const commonUtils = require('../utils/tools/commonUtils')
const mongoose = require('mongoose')
const dbHelper = require('../utils/helper/dbHelper')

/**
 * schema
 */
const the_schema = new mongoose.Schema({
      // 场次名
      name: {
        type: String, required: true, unique: true, index: true
      },
      // 开始时间
      start: {
        type: Date, required: true, default: 0
      },
      // 结束时间
      end: {
        type: Date, required: true, default: 0
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
    Vote.findOneAndUpdate(
        {_id: res._id},
        ip,
        err => {
          if (err) {
            logger.exec(`append ip for vote err: ${Logger.stringify(err.message)}`, Logger.DEBUG())
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
    return new Promise(resolve => {
      Vote.create(options)
          .then(res => {
            updateIp(res, options)
            logger.exec(`save successfully with options: ${Logger.stringify(options)}`, Logger.DEBUG())
            return resolve(res)
          })
          .catch(async err => {
            logger.exec(`save throw err`, Logger.ERROR(), err)
            return resolve()
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
    return new Promise(resolve => {
      Vote.update(filter, update, {multi: multi}, async function (err, mongoRes) {
        if (err) {
          logger.exec(`update throw err`, Logger.ERROR(), err)
          return resolve()
        }
        logger.exec(`update ${Logger.stringify(update)} successfully for filter: ${Logger.stringify(filter)}`, Logger.DEBUG())
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

  return new Promise(resolve => {
    Vote.find(options, async function (err, docs) {
      if (err) {
        logger.exec(`find throw err`, Logger.ERROR(), err)
        return resolve()
      }
      if (commonUtils.judgeNotNull(docs)) {
        logger.exec(`find successfully`, Logger.DEBUG())
      }
      return resolve(docs)
    })
  })
}

/**
 *  calculate the total number of records
 */
the_schema.statics.getCount = function (filter) {

  commonUtils.cleanFields(filter)
  dbHelper.filterBasics(filter)

  return new Promise(resolve => {
    Vote.count(filter, function (err, res) {
      if (err) {
        logger.exec(`find throw err`, Logger.ERROR(), err)
        return resolve()
      } else {
        logger.exec(`count successfully, res: ${res}`, Logger.DEBUG())
        resolve(res)
      }
    })
  })
}

const Vote = mongoose.model('Vote', the_schema)
module.exports = Vote