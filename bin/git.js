
var cp = require('child_process')
var express = require('express')


var verify = (signature, payload, secret) =>
  crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from('sha1=' +
      crypto.createHmac('sha1', secret).update(payload).digest('hex')
    )
  )


module.exports = (config) => {
  var api = express()

  api.use((req, res, next) => {
    var error = new Error()
    error.code = 400

    var sig = req.headers['x-hub-signature']
    var event = req.headers['x-github-event']
    var id = req.headers['x-github-delivery']

    if (!sig) {
      error.message = 'No X-Hub-Signature found on request'
      next(error)
      return
    }

    if (!event) {
      error.message = 'No X-Github-Event found on request'
      next(error)
      return
    }

    if (!id) {
      error.message = 'No X-Github-Delivery found on request'
      next(error)
      return
    }

    if (event !== 'push') {
      error.message = 'X-Github-Event is not acceptable'
      next(error)
      return
    }

    if (!verify(sig, JSON.stringify(req.body), config.git.secret)) {
      error.message = 'X-Hub-Signature does not match blob signature'
      next(error)
      return
    }

    next()
  })

  api.post('/git/pull', (req, res, next) => {
    var cmd = [
      'cd', config.git.repo, '&& git pull', config.git.remote, config.git.branch,
    ].join(' ')

    cp.exec(cmd, (err) => {
      if (err) {
        next(err.message)
        return
      }
      res.end('OK')
    })
  })

  api.use((err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)
    res.status(400).send(err.message)
  })

  return api
}
