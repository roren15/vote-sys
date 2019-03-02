'use strict'

module.exports = app => {

  const api = require('../apis/index')

  /**
   * @api {post} /vote vote create
   * @apiGroup vote
   * @apiVersion 0.1.0
   *
   * @apiParam (header) {String} auth-user-id user id
   * @apiParam (header) {String} auth-user-role user role
   * @apiParam (header) {String} auth-user-token user token
   *
   * @apiParam (body) {String} name vote name
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
  app.route('/vote').post(api.vote_handler)

  /**
   * @api {put} /vote vote update
   * @apiGroup vote
   * @apiVersion 0.1.0
   *
   * @apiParam (header) {String} auth-user-id user id
   * @apiParam (header) {String} auth-user-role user role
   * @apiParam (header) {String} auth-user-token user token
   *
   * @apiParam (body) {String} id vote id
   * @apiParam (body) {String} [name] vote name
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
  app.route('/vote').put(api.vote_handler)

  /**
   * @api {delete} /vote vote delete
   * @apiGroup vote
   * @apiVersion 0.1.0
   *
   * @apiParam (header) {String} auth-user-id user id
   * @apiParam (header) {String} auth-user-role user role
   * @apiParam (header) {String} auth-user-token user token
   *
   * @apiParam (body) {String} id vote id
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
  app.route('/vote').delete(api.vote_handler)
}