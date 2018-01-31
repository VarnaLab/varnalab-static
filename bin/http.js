
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})
var transform = require('./transform')()


module.exports = (config) => {
  var varnalab = purest({
    provider: 'varnalab',
    config: {
      varnalab: {
        [config.api]: {'{endpoint}': {__path: {alias: '__default'}}}
      }
    }
  })

  var upcoming = () =>
    varnalab
      .get('events/upcoming')
      .request()
      .then(([res, body]) => transform.events(body))

  var events = () =>
    varnalab
      .get('events')
      .qs({limit: 100000})
      .request()
      .then(([res, body]) => transform.events(
        body.filter((event) => new Date(event.start_time) < new Date())))

  var members = () =>
    varnalab
      .get('whois/known')
      .request()
      .then(([res, body]) => body)

  var articles = () =>
    varnalab
      .get('articles')
      .request()
      .then(([res, body]) => transform.articles(body))

  var cashbox = () =>
    varnalab
      .get('finance/invbg/cashbox')
      .request()
      .then(([res, body]) => transform.cashbox(body))

  return {upcoming, events, members, articles, cashbox}
}
