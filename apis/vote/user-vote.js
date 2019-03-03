'use strict'

const {config} = require('../../configs/config')
const Vote = require('../../models/vote')
const User = require('../../models/user')
const Candidate = require('../../models/candidate')
const User_vote_candidates = require('../../models/user_vote_candidates')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'vote-user-vote', config.log_view_level)
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
  const user_id = req.headers[enums.auth.AUTH_USER_ID]
  let vote_id = ''
  let candidate_ids = []
  let user_vote_candidates_options = {}
  let candidate_vote_users = {}

  if (!commonUtils.checkArgsNotNull(req_body.vote_name, req_body.candidate_names)) {
    return res.formatResponse('', enums.code.error.params, 'error params')
  }

  try {
    const vote_filter = {
      name: req_body.vote_name
    }
    const votes_find = await Vote.doFind(vote_filter)
    if (votes_find && votes_find.length > 0) {
      vote_id = votes_find[0]._id
    } else {
      return res.formatResponse('', enums.code.error.vote_invalid, 'vote invalid')
    }
    let candidate_filters = []
    req_body.candidate_names.forEach(candidate_name => {
      candidate_filters.push({
        name: candidate_name,
        voteId: vote_id
      })
    })
    candidate_filters.forEach(async candidate_filter => {
      const candidates_find = await Candidate.doFind(candidate_filter)
      if (candidates_find && candidates_find.length > 0) {
        candidate_ids.push(candidates_find[0]._id)
        const nums = candidates_find[0].voteNums++
        Candidate.doUpdate(candidate_filter, {
          voteNums: nums
        }, false)
      }
    })
    if (candidate_ids.length < 1) {
      return res.formatResponse('', enums.code.error.candidate_invalid, 'candidate invalid')
    }
    const user_vote_candidates_options = {
      userId: user_id,
      voteId: vote_id,
      candidateIds: candidate_ids
    }
    await User_vote_candidates.doCreate(user_vote_candidates_options)
    // todo: 1. how to support for update user-vote-candidates
  } catch (err) {
    logger.exec(`response failed`, Logger.ERROR(), err)
    return res.formatResponse('', enums.code.error.apis_handle, `response failed: ${err.message}`)
  }

  response.setData(res_data)
  return res.formatSend(response.getResponse())
}