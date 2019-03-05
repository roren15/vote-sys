'use strict'

const {config} = require('../../configs/config')
const Candidate = require('../../models/candidate')
const Vote = require('../../models/vote')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'candidate-handler', config.log_view_level)
const commonUtils = require('../../utils/tools/commonUtils')
const Response = require('../../utils/wrapper/response')
const enums = require('../../configs/enums')
const util = require('util')
const uuid = require('node-uuid')
const dbHelper = require('../../utils/helper/dbHelper')

module.exports = async function (req, res) {

  const response = new Response()
  const req_method = req.method
  const req_query = req.query
  const req_body = req.body
  let res_data = {}
  let filter = {
    _id: req_body.id || req_query.id,
    voteId: req_body.vote_id || req_query.vote_id,
  }
  if (!commonUtils.judgeNotNull(filter['voteId'])) {
    let vote_filter = {
      _id: filter['voteId']
    }
    // need to check vote's start time
    dbHelper.filterTime(vote_filter, 'start', new Date(), null)
    const votes_find = await Vote.doFind(vote_filter)
    if (!commonUtils.judgeNotNull(votes_find) && req_method !== enums.request_method.get) {
      return res.formatResponse('', enums.code.error.candidate_cannot_be_operated, 'operate invalid')
    }
  }

  try {
    switch (req_method) {
      case enums.request_method.get:
        const candidates_find = await Candidate.doFind(filter)
        res_data = []
        candidates_find.forEach(candidate => {
          res_data.push({
            name: candidate.name,
            id: candidate._id,
            vote_count: candidate.userIds && candidate.userIds.length
          })
        })
        break
      case enums.request_method.post:
        if (!commonUtils.checkArgsNotNull(req_body.name)) {
          return res.formatResponse('', enums.code.error.params, 'error params')
        }
        const options = {
          name: req_body.name,
          voteId: req_body.vote_id
        }
        const candidate_create = await Candidate.doCreate(options)
        res_data = {
          name: candidate_create.name,
          id: candidate_create._id
        }
        break
      case enums.request_method.put:
        if (!commonUtils.checkArgsNotNull(req_body.id)) {
          return res.formatResponse('', enums.code.error.params, 'error params')
        }
        const update = {
          name: req_body.name
        }
        await Candidate.doUpdate(filter, update, false)
        break
      case enums.request_method.delete:
        if (!commonUtils.checkArgsNotNull(req_body.id)) {
          return res.formatResponse('', enums.code.error.params, 'error params')
        }
        const deleted = {
          isDelete: true
        }
        await Candidate.doUpdate(filter, deleted, false)
        break
    }
  } catch (err) {
    logger.exec(`response failed`, Logger.ERROR(), err)
    return res.formatResponse('', enums.code.error.apis_handle, `response failed: ${err.message}`)
  }

  response.setData(res_data)
  return res.formatSend(response.getResponse())
}