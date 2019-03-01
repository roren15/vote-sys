'use strict'

const path = require('path')
global.appEnv = 'TEST'
global.appRoot = path.join(__dirname, '..')

const request = require('supertest')
const assert = require('assert')
const should = require("should")
const JSON = require('circular-json')
const _ = require('lodash')
const express = require('express')
const consign = require('consign')
const app = express()
const startTime = new Date().toISOString()

// consign is used to load modules automatically through the specified order.
const commonConsign = consign({verbose: true})
    .include('configs/config.js')
    .then('libs/db.js')
    .then('libs/middleware.js')
    .then('libs/http-server.js')
    .then('routes')
commonConsign.into(app)

// const agent = request.agent(basicUrl)
const agent = request(app)
const commonQuery = {}
const register_body = {
  mail: '13204611934@126.com',
  username: 'roren',
  role: 'USER'
}
let register_res = {}
let token = ''

describe(`start at: ${startTime}`, function () {

  this.timeout({
    response: 60 * 1000,
    deadline: 5 * 60 * 1000,
  })

  describe('test system api', function () {

    it(`test system register`, done => {
      agent
          .post('/register')
          .set("Content-Type", "application/json")
          .send(register_body)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            res.body.data.should.not.be.empty()
            register_res = res.body.data
            done()
          })
    })

    it(`test system validate-mail`, done => {
      agent
          .get('/validate_mail')
          .set("Content-Type", "application/json")
          .query(register_res)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            res.body.data.should.not.be.empty()
            res.body.data.should.have.key('token')
            token = res.body.data.token
            done()
          })
    })
  })
})