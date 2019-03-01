'use strict'

module.exports = app => {

  const api = require('../apis/index')

  /**
   * @api {get} / API Status
   * @apiGroup Status
   * @apiVersion 0.0.1
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
}