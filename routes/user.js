'use strict'

module.exports = app => {

  const api = require('../apis/index')

  /**
   * @api {put} /user user update
   * @apiGroup System
   * @apiVersion 0.1.0
   *
   * @apiParam (body) {String} [username] username
   * @apiParam (body) {String} mail mail address
   *
   * @apiSuccessExample {json} Success
   *  {
   *    code: 200,
   *    data: {"
   *
   *    },
   *    message: ""
   *  }
   * @apiErrorExample {json} Error-Response:
   *  {
   *    code: 500,
   *    data: {},
   *    message: ""
   *  }
   */
  app.route('/user').put(api.user_handler)

  /**
   * @api {post} /user/vote user vote for candidates
   * @apiGroup User
   * @apiVersion 0.1.0
   *
   * @apiParam (header) {String} auth-user-id user id
   * @apiParam (header) {String} auth-user-role user role
   * @apiParam (header) {String} auth-user-token user token
   *
   * @apiParam (body) {String} [candidate_ids] candidate ids
   * @apiParam (body) {String} vote_id vote id
   *
   * @apiSuccessExample {json} Success
   *  {
   *    code: 200,
   *    data: {
   *
   *    },
   *    message: ""
   *  }
   * @apiErrorExample {json} Error-Response:
   *  {
   *    code: 500,
   *    data: {},
   *    message: ""
   *  }
   */
  app.route('/user/vote').post(api.user_vote)
}