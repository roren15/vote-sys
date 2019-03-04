'use strict'

module.exports = app => {

  const api = require('../apis/index')

  /**
   * @api {post} /login login
   * @apiGroup System
   * @apiVersion 0.1.0
   *
   * @apiParam (body) {String} mail mail address
   * @apiParam (body) {String} password password
   *
   * @apiSuccessExample {json} Success
   *  {
   *    code: 200,
   *    data: {"token":"e63847a0-3d8a-11e9-b828-c936b3731f27","userId":"5c7b8a6e51ffbd582ccfc181","role":"USER"},
   *    message: ""
   *  }
   * @apiErrorExample {json} Error-Response:
   *  {
   *    code: 500,
   *    data: {},
   *    message: ""
   *  }
   */
  app.route('/login').post(api.sys_login)

  /**
   * @api {post} /register register
   * @apiGroup System
   * @apiVersion 0.1.0
   *
   * @apiParam (body) {String} [username] register name
   * @apiParam (body) {String} [role] default for "USER"
   * @apiParam (body) {String} mail mail address
   * @apiParam (body) {String} [vote_id] vote id
   *
   * @apiSuccessExample {json} Success
   *  {
   *    code: 200,
   *    data: {"mail":"152393288@qq.com","validate_code":"e6349e20-3d8a-11e9-b828-c936b3731f27"},
   *    message: ""
   *  }
   * @apiErrorExample {json} Error-Response:
   *  {
   *    code: 500,
   *    data: {},
   *    message: ""
   *  }
   */
  app.route('/register').post(api.sys_register)

  /**
   * @api {get} /validate_mail validate mail
   * @apiGroup System
   * @apiVersion 0.1.0
   *
   * @apiParam (query) {String} [validate_code] validate code
   * @apiParam (query) {String} mail mail address
   * @apiParam (query) {String} password password
   *
   * @apiSuccessExample {json} Success
   *  {
   *    code: 200,
   *    data: {"token":"e63847a0-3d8a-11e9-b828-c936b3731f27","userId":"5c7b8a6e51ffbd582ccfc181","role":"USER"},
   *    message: ""
   *  }
   * @apiErrorExample {json} Error-Response:
   *  {
   *    code: 500,
   *    data: {},
   *    message: ""
   *  }
   */
  app.route('/validate_mail').get(api.sys_validate_mail)
}