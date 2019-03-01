'use strict'

module.exports = app => {

  const api = require('../apis/index')

  app.route('/login').post(api.sys_login);

  /**
   * @api {post} /register register
   * @apiGroup System
   * @apiVersion 0.1.0
   *
   * @apiParam (body) {String} [username] register name
   * @apiParam (body) {String} [role] default for "USER"
   * @apiParam (body) {String} mail mail address
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
  app.route('/register').post(api.sys_register);

  /**
   * @api {get} /validate_mail validate mail
   * @apiGroup System
   * @apiVersion 0.1.0
   *
   * @apiParam (query) {String} [validate_code] validate code
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
  app.route('/validate_mail').get(api.sys_validate_mail);
}