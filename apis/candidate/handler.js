'use strict'

const {config} = require('../../configs/config')
const Candidate = require('../../models/candidate')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'candidate-handler', config.log_view_level)
const commonUtils = require('../../utils/tools/commonUtils')
const Response = require('../../utils/wrapper/response')
const enums = require('../../configs/enums')
const util = require('util')
const uuid = require('node-uuid')

module.exports = async function (req, res) {

  const response = new Response()
  const req_method = req.method
  const req_query = req.query
  const req_body = req.body
  let res_data = {}
  const filter = {
    _id: req_body.id
  }

  try {
    switch (req_method) {
      case enums.request_method.get:
        const candidates_find = await Candidate.doFind(filter)
        res_data['name'] = []
        candidates_find.forEach(candidate => {
          res_data['name'].push(candidate.name)
        })
        break
      case enums.request_method.post:
        if (!commonUtils.checkArgsNotNull(req_body.name)) {
          return res.formatResponse('', enums.code.error.params, 'error params')
        }
        const options = {
          name: req_body.name
        }
        const candidate_create = await Candidate.doCreate(options)
        res_data['id'] = candidate_create._id
        break
      case enums.request_method.put:
        if (!commonUtils.checkArgsNotNull(req_body.id)) {
          return res.formatResponse('', enums.code.error.params, 'error params')
        }
        const update = {
          name: req_body.name
        }
        await Candidate.doUpdate(filter, update)
        break
      case enums.request_method.delete:
        if (!commonUtils.checkArgsNotNull(req_body.id)) {
          return res.formatResponse('', enums.code.error.params, 'error params')
        }
        const deleted = {
          isDelete: true
        }
        await Candidate.doUpdate(filter, deleted)
        break
    }
  } catch (err) {
    logger.exec(`response failed`, Logger.ERROR(), err)
    return res.formatResponse('', enums.code.error.apis_handle, `response failed: ${err.message}`)
  }

  response.setData(res_data)
  return res.formatSend(response.getResponse())
}