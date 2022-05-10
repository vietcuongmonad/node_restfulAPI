const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000  // environment variable port or hard-code

const server = http.createServer(app)

server.listen(port)