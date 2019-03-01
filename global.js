const path = require('path')
const env = process.env.NODE_ENV && process.env.NODE_ENV.toString().toUpperCase()

global.appEnv = env ? env : global.appEnv
global.appRoot = path.resolve(__dirname)