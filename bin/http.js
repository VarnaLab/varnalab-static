
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})
var moment = require('moment')
moment.locale('bg')


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
      .then(([res, body]) =>
        body
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
          .map((event) => (
            event.time1 = moment(event.start_time).format('LL'),
            event.time2 = moment(event.start_time).format('LLLL').split(',')[0],
            event.time3 = moment(event.start_time).format('LT'),
            event
          ))
      )

  var events = () =>
    varnalab
      .get('events')
      .qs({limit: 100000})
      .request()
      .then(([res, body]) =>
        body
        .filter((event) => new Date(event.start_time) < new Date())
        .map((event) => (
          event.time1 = moment(event.start_time).format('LL'),
          event.time2 = moment(event.start_time).format('LLLL').split(',')[0],
          event.time3 = moment(event.start_time).format('LT'),
          event
        ))
      )

  var members = () =>
    varnalab
      .get('whois/known')
      .request()
      .then(([res, body]) => body)

  return {upcoming, events, members}
}
