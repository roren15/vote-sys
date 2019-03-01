const {config} = require('../../configs/config')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'script', config.log_view_level)
const {exec} = require('child_process')

module.exports = {

  /**
   * execute script
   * @param script
   * @returns {Promise<String|Error>}
   */
  execScript(script) {

    return new Promise((resolve, reject) => {
      exec(script, async (err, stdout, stderr) => {
        if (err) {
          return reject(await logger.exec(`index exec ${script} error : ${Logger.stringify(err)} , ${Logger.stringify(stderr)}`, Logger.ERROR()))
        }
        return resolve(await logger.exec(`index exec ${Logger.stringify(script)} stdout : ${Logger.stringify(stdout)}`))
      })
    })
  },
}