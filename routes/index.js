'use strict'

module.exports = app => {

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
}