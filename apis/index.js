'use strict'

exports.sys_login = require('./sys/login')
exports.sys_register = require('./sys/register')
exports.sys_validate_mail = require('./sys/validate-mail')
exports.candidate_handler = require('./candidate/handler')
exports.vote_handler = require('./vote/handler')
exports.user_vote = require('./vote/user-vote')