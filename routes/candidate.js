'use strict'

module.exports = app => {

  const api = require('../apis/index')

  /**
   * @api {post} /candidate candidate create
   * @apiGroup Candidate
   * @apiVersion 0.1.0
   *
   * @apiParam (header) {String} auth-user-id user id
   * @apiParam (header) {String} auth-user-role user role
   * @apiParam (header) {String} auth-user-token user token
   *
   * @apiParam (body) {String} name candidate name
   *
   * @apiSuccessExample {json} Success
   *  {
   *    code: 200,
   *    data: {"id":"5c7b8a6e51ffbd582ccfc183"},
   *    message: ""
   *  }
   * @apiErrorExample {json} Error-Response:
   *  {
   *    code: 500,
   *    data: {},
   *    message: ""
   *  }
   */
  app.route('/candidate').post(api.candidate_handler)

  /**
   * @api {put} /candidate candidate update
   * @apiGroup Candidate
   * @apiVersion 0.1.0
   *
   * @apiParam (header) {String} auth-user-id user id
   * @apiParam (header) {String} auth-user-role user role
   * @apiParam (header) {String} auth-user-token user token
   *
   * @apiParam (body) {String} id candidate id
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
  app.route('/candidate').put(api.candidate_handler)

  /**
   * @api {delete} /candidate candidate delete
   * @apiGroup Candidate
   * @apiVersion 0.1.0
   *
   * @apiParam (header) {String} auth-user-id user id
   * @apiParam (header) {String} auth-user-role user role
   * @apiParam (header) {String} auth-user-token user token
   *
   * @apiParam (body) {String} id candidate id
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
  app.route('/candidate').delete(api.candidate_handler)

  /**
   * @api {get} /candidate candidate get
   * @apiGroup Candidate
   * @apiVersion 0.1.0
   *
   * @apiParam (header) {String} auth-user-id user id
   * @apiParam (header) {String} auth-user-role user role
   * @apiParam (header) {String} auth-user-token user token
   *
   * @apiParam (body) {String} id candidate id
   *
   * @apiSuccessExample {json} Success
   *  {
   *    code: 200,
   *    data: {"name":["C_re_create"]},
   *    message: ""
   *  }
   * @apiErrorExample {json} Error-Response:
   *  {
   *    code: 500,
   *    data: {},
   *    message: ""
   *  }
   */
  app.route('/candidate').get(api.candidate_handler)
}