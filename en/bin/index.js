#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log('--config /path/to/config.json')
  console.log('--render /path/to/render/location/')
  console.log('--server /path/to/serve/location/')
  console.log('--force')
  console.log('--env environment')
  process.exit()
}

if (!argv.config) {
  console.log('Specify --config /path/to/config.json')
  process.exit()
}

var env = process.env.NODE_ENV || argv.env

if (!env) {
  console.log('Specify --env environment')
  process.exit()
}

if (argv.render && typeof argv.render !== 'string') {
  console.log('Specify --render /path/to/render/location/')
  process.exit()
}

if (argv.server && typeof argv.server !== 'string') {
  console.log('Specify --server /path/to/serve/location/')
  process.exit()
}


var fs = require('fs')
var path = require('path')
var config = require(path.resolve(process.cwd(), argv.config))[env]
var render = require('./render')
var Server = require('./server')


if (argv.render) {
  var location = path.resolve(process.cwd(), argv.render)
  if (!fs.existsSync(location)) {
    fs.mkdirSync(location)
  }
  if (!fs.existsSync(path.join(location, '/events'))) {
    fs.mkdirSync(path.join(location, '/events'))
  }
  if (!fs.existsSync(path.join(location, '/articles'))) {
    fs.mkdirSync(path.join(location, '/articles'))
  }
  render(config, location, argv.force)
    .then(() => console.log('VarnaLab Static Render Complete'))
    .catch((err) => console.error(err))
}

else if (argv.server) {
  var location = path.resolve(process.cwd(), argv.server)
  var server = Server(config, location)
  server.listen(config.server.port, () =>
    console.log('VarnaLab Static Server', config.server.port)
  )
}

else {
  console.log('Specify --render or --server')
}
