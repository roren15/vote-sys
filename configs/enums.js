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
      snore_collect: 40001,
      file: 40002,
      without_files: 40003,
      db: 40004,
    },
  },
  constant: {
    AUTH_USER_ID: 'auth-user-id',
    AUTH_USER_ROLE: 'auth-user-role',
    AUTH_USER_TOKEN: 'auth-user-token',
  },
  responseType: {
    json: 'Json',
    buffer: 'Buffer',
  },
  requestMethod: {
    get: 'GET',
    post: 'POST',
  },
  responseCode: {
    api_voice: 'code',
    default: 'statusCode',
  },
}

module.exports = Enums