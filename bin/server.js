
var fs = require('fs')
var path = require('path')
var express = require('express')
var static = require('serve-static')


module.exports = (config) => {
  var prefix = config.path || ''
  var app = express()

  app.use(`${prefix}/css`, static(path.join(config.assets, '/css')))
  app.use(`${prefix}/js`, static(path.join(config.assets, '/js')))
  app.use(`${prefix}/images`, static(path.join(config.assets, '/images')))

  app.use(`${prefix}/about`, static(config.html, {index: 'about.html'}))
  app.use(`${prefix}/events`, static(config.html, {index: 'events.html'}))
  app.use(`${prefix}/members`, static(config.html, {index: 'members.html'}))
  app.use(`${prefix}/links`, static(config.html, {index: 'links.html'}))
  app.use(`${prefix}/contacts`, static(config.html, {index: 'contacts.html'}))

  app.use(`${prefix}/events:page`, (req, res) => {
    fs.readFile(
      path.join(config.html, '/events', `${req.params.page}.html`),
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

  app.use(`${prefix}/`, static(config.html, {index: 'home.html'}))

  return app
}
