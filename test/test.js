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

const commonConsign = consign({verbose: true})
    .include('configs/config.js')
    .then('libs/db.js')
    .then('libs/middleware.js')
    .then('libs/http-server.js')
    .then('routes')
commonConsign.into(app)

const agent = request(app)
const commonQuery = {}
const register_body = {
  mail: '13204611934@126.com',
  username: 'roren',
  role: 'USER'
}
const register_admin_body = {
  mail: '152393288@qq.com',
  username: 'admin',
  role: 'ADMIN'
}
let user_register_res = {}
let admin_register_res = {}
let user_auth = {}
let admin_auth = {}
const candidate_create_body = {
  name: 'C_create',
}
let candidate_update_body = {
  name: 'C_update',
}
let candidate_delete_body = {}
const candidate_re_create_body = {
  name: 'C_re_create',
}
const vote_create_body = {
  name: 'V_create',
}
let vote_update_body = {
  name: 'V_update',
}
let vote_delete_body = {}
const vote_re_create_body = {
  name: 'V_re_create',
}

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
            user_register_res = res.body.data
            done()
          })
    })

    it(`test system admin register`, done => {
      agent
          .post('/register')
          .set("Content-Type", "application/json")
          .send(register_admin_body)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            res.body.data.should.not.be.empty()
            admin_register_res = res.body.data
            done()
          })
    })

    it(`test system validate-mail`, done => {
      agent
          .get('/validate_mail')
          .set("Content-Type", "application/json")
          .query(user_register_res)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            res.body.data.should.not.be.empty()
            res.body.data.should.have.key('token')
            res.body.data.should.have.key('userId')
            res.body.data.should.have.key('role')
            user_auth['auth-user-token'] = res.body.data.token
            user_auth['auth-user-id'] = res.body.data.userId
            user_auth['auth-user-role'] = res.body.data.role
            done()
          })
    })

    it(`test system validate-mail`, done => {
      agent
          .get('/validate_mail')
          .set("Content-Type", "application/json")
          .query(admin_register_res)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            res.body.data.should.not.be.empty()
            res.body.data.should.have.key('token')
            res.body.data.should.have.key('userId')
            res.body.data.should.have.key('role')
            admin_auth['auth-user-token'] = res.body.data.token
            admin_auth['auth-user-id'] = res.body.data.userId
            admin_auth['auth-user-role'] = res.body.data.role
            done()
          })
    })
  })

  describe('test candidate api', function () {

    it(`test candidate create`, done => {
      agent
          .post('/candidate')
          .set("Content-Type", "application/json")
          .set("auth-user-token", admin_auth['auth-user-token'])
          .set("auth-user-id", admin_auth['auth-user-id'])
          .set("auth-user-role", admin_auth['auth-user-role'])
          .send(candidate_create_body)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            res.body.data.should.have.key('id')
            candidate_update_body['id'] = res.body.data.id
            candidate_delete_body['id'] = res.body.data.id
            done()
          })
    })

    it(`test candidate update`, done => {
      agent
          .put('/candidate')
          .set("Content-Type", "application/json")
          .set("auth-user-token", admin_auth['auth-user-token'])
          .set("auth-user-id", admin_auth['auth-user-id'])
          .set("auth-user-role", admin_auth['auth-user-role'])
          .send(candidate_update_body)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            done()
          })
    })

    it(`test candidate delete`, done => {
      agent
          .delete('/candidate')
          .set("Content-Type", "application/json")
          .set("auth-user-token", admin_auth['auth-user-token'])
          .set("auth-user-id", admin_auth['auth-user-id'])
          .set("auth-user-role", admin_auth['auth-user-role'])
          .send(candidate_delete_body)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            done()
          })
    })

    it(`test candidate re-create`, done => {
      agent
          .post('/candidate')
          .set("Content-Type", "application/json")
          .set("auth-user-token", admin_auth['auth-user-token'])
          .set("auth-user-id", admin_auth['auth-user-id'])
          .set("auth-user-role", admin_auth['auth-user-role'])
          .send(candidate_re_create_body)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            res.body.data.should.have.key('id')
            done()
          })
    })

    it(`test candidate get`, done => {
      agent
          .get('/candidate')
          .set("Content-Type", "application/json")
          .set("auth-user-token", user_auth['auth-user-token'])
          .set("auth-user-id", user_auth['auth-user-id'])
          .set("auth-user-role", user_auth['auth-user-role'])
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            done()
          })
    })
  })

  describe('test vote api', function () {

    it(`test vote create`, done => {
      agent
          .post('/vote')
          .set("Content-Type", "application/json")
          .set("auth-user-token", admin_auth['auth-user-token'])
          .set("auth-user-id", admin_auth['auth-user-id'])
          .set("auth-user-role", admin_auth['auth-user-role'])
          .send(vote_create_body)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            res.body.data.should.have.key('id')
            vote_update_body['id'] = res.body.data.id
            vote_delete_body['id'] = res.body.data.id
            done()
          })
    })

    it(`test vote update`, done => {
      agent
          .put('/vote')
          .set("Content-Type", "application/json")
          .set("auth-user-token", admin_auth['auth-user-token'])
          .set("auth-user-id", admin_auth['auth-user-id'])
          .set("auth-user-role", admin_auth['auth-user-role'])
          .send(vote_update_body)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            done()
          })
    })

    it(`test vote delete`, done => {
      agent
          .delete('/vote')
          .set("Content-Type", "application/json")
          .set("auth-user-token", admin_auth['auth-user-token'])
          .set("auth-user-id", admin_auth['auth-user-id'])
          .set("auth-user-role", admin_auth['auth-user-role'])
          .send(vote_delete_body)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            done()
          })
    })

    it(`test vote re-create`, done => {
      agent
          .post('/vote')
          .set("Content-Type", "application/json")
          .set("auth-user-token", admin_auth['auth-user-token'])
          .set("auth-user-id", admin_auth['auth-user-id'])
          .set("auth-user-role", admin_auth['auth-user-role'])
          .send(vote_re_create_body)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            res.body.data.should.have.key('id')
            done()
          })
    })

    it(`test vote get`, done => {
      agent
          .get('/vote')
          .set("Content-Type", "application/json")
          .set("auth-user-token", user_auth['auth-user-token'])
          .set("auth-user-id", user_auth['auth-user-id'])
          .set("auth-user-role", user_auth['auth-user-role'])
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.equal(200)
            done()
          })
    })
  })
})