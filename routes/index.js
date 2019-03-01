'use strict'

module.exports = app => {

  const api = require('../apis/index')

  /**
   * @api {get} / API Status
   * @apiGroup Status
   * @apiVersion 0.1.0
   *
   * @apiParamExample {json} Request-Example:
   * {
   *
   * }
   *
   * @apiSuccessExample {json} Success
   *  {
   *    status: "success"
   *  }
   * @apiErrorExample {json} Error-Response:
   *  {
   *
   *  }
   */
  app.get('/', (req, res) => {
    res.json({
      status: "success"
    })
  })

  // system
  /**
   * @api {post} /login Login
   * @apiGroup System
   * @apiVersion 0.1.0
   *
   * @apiParam (body) {String} [login] login name
   * @apiParam (body) {String} group credential
   *
   * @apiSuccessExample {json} Success
   *  {
   *    code: 200,
   *    data: {
   *      "group":"19332074050"
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
  app.route('/login').post(api.login);

  /**
   * @api {get} /register register
   * @apiGroup System
   * @apiVersion 0.1.0
   *
   * @apiParam (query) {String} [username] register name
   * @apiParam (query) {String} [role] default for "USER"
   * @apiParam (query) {String} mail mail address
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
  app.route('/register').post(api.register);
}