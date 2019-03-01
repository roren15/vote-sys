'user strict'

const {config} = require('../../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'dbHelper', config.log_view_level)
const https = require('https')
const commonUtils = require('../../utils/tools/commonUtils')
const enums = require('../../configs/enums')

module.exports = {

  filterBasics(filter) {

    return Object.assign(filter, {isDelete: false})
  },

  filterCreatedTime(filter) {

    if (commonUtils.checkArgsNotNull(filter['startTime'], filter['endTime'])) {
      filter['createdAt'] = {'$gte': filter['startTime'], '$lte': filter['endTime']}
      delete filter['startTime']
      delete filter['endTime']
    }
    return filter
  },

  filterCurrentPage(filter) {

    const currentPage = filter['currentPage']
    if (commonUtils.judgeNotNull(currentPage)) {
      delete filter['currentPage']
    }
    return currentPage
  },

  /**
   * exec successfully
   * @param docs
   * @param method_name
   * @returns {Promise<*>}
   */
  execSucc(docs, method_name) {

    logger.exec(`${method_name} exec successfully`, Logger.DEBUG())
    if (!docs) {
      return logger.exec(`${method_name} return nothing`, Logger.DEBUG())
    }
    return docs
  },

  /**
   * exec failed
   * @param err
   * @param method_name
   * @returns {Promise<*>}
   */
  execErr(err, method_name) {

    return logger.exceptionThrows(`${method_name} then throws error: ${Logger.stringify(err)}`)
  },

  /**
   * common execution of method
   * @param model: Sequelize model instance
   * @param method_name: name of method to execute
   * @param options: content to exec
   * @param filter: (optional) filter query res
   * @returns {Promise<>}
   */
  async commonMethodExec(model, method_name, options = {}, filter) {

    const that = this
    return new Promise(async (resolve, reject) => {
      if (commonUtils.checkObjMethod(model, method_name)) {
        const real_method = model[method_name]
        commonUtils.judgeNotNull(filter) ?
            real_method.call(model, options, filter)
                .then(docs =>
                    resolve(that.execSucc(docs, method_name))
                )
                .catch(err =>
                    reject(that.execErr(err, method_name))
                ) :
            real_method.call(model, options)
                .then(docs =>
                    resolve(that.execSucc(docs, method_name))
                )
                .catch(err =>
                    reject(that.execErr(err, method_name))
                )
      } else {
        return reject(await logger.exceptionThrows(`err parameters`))
      }
    })
  },

  /**
   * check args before exec
   * @param args
   */
  checkArgsNotNull(...args) {

    if (!commonUtils.checkArgsNotNull(args[0])) {
      logger.exceptionThrows(`err parameters`)
    }
  },

  async find(model, filter = {}) {

    this.checkArgsNotNull(model)
    const method_name = 'findAll'

    return await this.commonMethodExec(model, method_name, filter)
  },

  async findAndCountAll(model, filter = {}) {

    this.checkArgsNotNull(model)
    const method_name = 'findAndCountAll'

    return await this.commonMethodExec(model, method_name, filter)
  },

  async create(model, options) {

    this.checkArgsNotNull(arguments)
    const method_name = 'create'

    return await this.commonMethodExec(model, method_name, options)
  },

  async update(model, options, filter) {

    this.checkArgsNotNull(arguments)
    const method_name = 'update'

    return await this.commonMethodExec(model, method_name, options, filter)
  },
}