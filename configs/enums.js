const Enums = {

  env: {
    dev: 'DEVELOPMENT',
    test: 'TEST',
    prod: 'PRODUCTION'
  },
  code: {
    success: {
      default: 200
    },
    error: {
      default: 500,
      params: 40000,
      db: 40001,
      apis_handle: 40002,
      auth: 40003,
      email_invalid: 40101,
      email_used: 40102,
      email_validate_code_invalid: 40103,
    },
  },
  auth: {
    AUTH_USER_ID: 'auth-user-id',
    AUTH_USER_ROLE: 'auth-user-role',
    AUTH_USER_TOKEN: 'auth-user-token',
  },
  user_role: {
    user: 'USER',
    admin: 'ADMIN',
  },
  response_type: {
    json: 'Json',
    buffer: 'Buffer',
  },
  request_method: {
    get: 'GET',
    post: 'POST',
  },
  response_code: {
    api_voice: 'code',
    default: 'statusCode',
  },
}

module.exports = Enums