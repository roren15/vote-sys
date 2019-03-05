'use strict'

const {config} = require('../../configs/config')
const Vote = require('../../models/vote')
const User = require('../../models/user')
const Candidate = require('../../models/candidate')
const Logger = require('js-standard-logger')
const logger = new Logger(config.log_save_dir, config.log_save_file, 'user-vote', config.log_view_level)
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
  const user_id = req.headers[enums.auth.AUTH_USER_ID]

  if (!commonUtils.checkArgsNotNull(req_body.vote_id)) {
    return res.formatResponse('', enums.code.error.params, 'error params')
  }

  try {
    let vote, user

    /*
      find vote
     */
    let vote_filter = {
      _id: req_body.vote_id
    }
    // need to check vote's end time
    dbHelper.filterTime(vote_filter, 'end', null, new Date())
    const votes_find = await Vote.doFind(vote_filter)
    if (!(commonUtils.judgeNotNull(votes_find))) {
      return res.formatResponse('', enums.code.error.vote_invalid, 'vote invalid')
    } else {
      vote = votes_find[0]
    }
    /*
      find and update both user and candidate
     */
    if (commonUtils.judgeNotNull(req_body.candidate_ids) && commonUtils.getType(req_body.candidate_ids) === 'array') {
      // vote rule: voting candidates required to half of candidates in that vote, at least 2, but most 5
      const candidate_count = Candidate.getCount({
        voteId: req_body.vote_id,
      })
      if (req_body.candidate_ids.length < 2 || req_body.candidate_ids.length > 5) {
        return res.formatResponse('', enums.code.error.user_vote_candidates_num_err, 'vote invalid')
      }
      req_body.candidate_ids.forEach(async candidate_id => {
        // not support for multi votes per user
        const candidate_filter = {
          _id: candidate_id,
          voteId: req_body.vote_id,
        }
        const candidates_find = await Candidate.doFind(candidate_filter)
        if (commonUtils.judgeNotNull(candidates_find)) {
          const candidate = candidates_find[0]
          if (!(commonUtils.judgeNotNull(candidate.userIds) && candidate.userIds.indexOf(user_id) !== -1)) {
            Candidate.doUpdate(candidate_filter, {
              $push: {
                userIds: user_id
              }
            }, false)
          }
          /*
            update user
          */
          const user_filter = {
            _id: user_id,
            voteId: req_body.vote_id,
          }
          const users_find = await User.doFind(user_filter)
          if (commonUtils.judgeNotNull(users_find)) {
            user = users_find[0]
            if (!(commonUtils.judgeNotNull(user.candidateIds) && user.candidateIds.indexOf(candidate_id) !== -1)) {
              User.doUpdate(user_filter, {
                $push: {
                  candidateIds: candidate_id
                }
              }, false)
            }
          }
        }
      })
    }
  } catch (err) {
    logger.exec(`response failed`, Logger.ERROR(), err)
    return res.formatResponse('', enums.code.error.apis_handle, `response failed: ${err.message}`)
  }

  response.setData(res_data)
  return res.formatSend(response.getResponse())
}