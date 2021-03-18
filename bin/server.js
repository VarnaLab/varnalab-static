
var fs = require('fs')
var path = require('path')
var express = require('express')
var static = require('serve-static')
var parser = require('body-parser')
var git = require('./git')


module.exports = (config, location) => {
  var prefix = config.path || ''
  var app = express()

  app.use(parser.json())
  app.use(`${prefix}/api`, git(config))

  app.use(`${prefix}/css`, static(path.join(config.server.assets, '/css')))
  app.use(`${prefix}/js`, static(path.join(config.server.assets, '/js')))
  app.use(`${prefix}/images`, static(path.join(config.server.assets, '/images')))

  app.use(`${prefix}/about`, static(location, {index: 'about.html'}))
  app.use(`${prefix}/events`, static(location, {index: 'events.html'}))
  app.use(`${prefix}/blogs`, static(location, {index: 'articles.html'}))
  app.use(`${prefix}/members`, static(location, {index: 'members.html'}))
  app.use(`${prefix}/links`, static(location, {index: 'links.html'}))
  app.use(`${prefix}/contacts`, static(location, {index: 'contacts.html'}))
  app.use(`${prefix}/finance`, static(location, {index: 'finance.html'}))
  app.use(`${prefix}/donate`, static(location, {index: 'donate.html'}))

  app.use(`${prefix}/events/:page`, (req, res) => {
    fs.readFile(
      path.join(location, '/events', `${req.params.page}.html`),
      'utf8',
      (err, html) => {
        if (err) {
          res.end()
        }
        else {
          res.set('content-type', 'text/html')
          res.end(html)
        }
      }
    )
  })

  app.use(`${prefix}/blogs/:y/:m/:d/:slug`, (req, res) => {
    fs.readFile(
      path.join(location, '/articles', `${req.params.slug}.html`),
      'utf8',
      (err, html) => {
        if (err) {
          res.end()
        }
        else {
          res.set('content-type', 'text/html')
          res.end(html)
        }
      }
    )
  })

  app.use(`${prefix}/`, static(location, {index: 'about.html'}))

  app.use(`${prefix}/89fd43a2409b6e74768e5e5a66dcda43.txt`, (req, res) => {
    res.set('content-type', 'text/plain')
    res.send('')
  })

  return app
}
