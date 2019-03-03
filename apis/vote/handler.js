'use strict'

const {config} = require('../../configs/config')
const Vote = require('../../models/vote')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'vote-handler', config.log_view_level)
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
    // todo: support for rule
    switch (req_method) {
      case enums.request_method.get:
        const votes_find = await Vote.doFind(filter)
        res_data['name'] = []
        votes_find.forEach(vote => {
          res_data['name'].push(vote.name)
        })
        break
      case enums.request_method.post:
        if (!commonUtils.checkArgsNotNull(req_body.name)) {
          return res.formatResponse('', enums.code.error.params, 'error params')
        }
        const options = {
          name: req_body.name
        }
        const vote_create = await Vote.doCreate(options)
        res_data['id'] = vote_create._id
        break
      case enums.request_method.put:
        if (!commonUtils.checkArgsNotNull(req_body.id)) {
          return res.formatResponse('', enums.code.error.params, 'error params')
        }
        const update = {
          name: req_body.name
        }
        await Vote.doUpdate(filter, update, false)
        break
      case enums.request_method.delete:
        if (!commonUtils.checkArgsNotNull(req_body.id)) {
          return res.formatResponse('', enums.code.error.params, 'error params')
        }
        const deleted = {
          isDelete: true
        }
        await Vote.doUpdate(filter, deleted, false)
        break
    }
  } catch (err) {
    logger.exec(`response failed`, Logger.ERROR(), err)
    return res.formatResponse('', enums.code.error.apis_handle, `response failed: ${err.message}`)
  }

  response.setData(res_data)
  return res.formatSend(response.getResponse())
}