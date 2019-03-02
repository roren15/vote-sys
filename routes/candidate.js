'use strict'

module.exports = app => {

  const api = require('../apis/index')

  /**
   * @api {post} /candidate/create candidate create
   * @apiGroup Candidate
   * @apiVersion 0.1.0
   *
   * @apiParam (header) {String} auth-user-id user id
   * @apiParam (header) {String} auth-user-role user role
   * @apiParam (header) {String} auth-user-token user token
   *
   * @apiParam (body) {String} [name] candidate name
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
  app.route('/candidate/create').post(api.candidate_create);
}