
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

  var format = (event) => (
    event.time1 = moment(event.start_time).format('LL'),
    event.time2 = moment(event.start_time).format('LLLL').split(',')[0],
    event.time3 = moment(event.start_time).format('LT'),
    event.description = (event.description || '')
      .replace(/\n/gi, '<br>')
      .replace(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
        (url) => `<a href="${url}">${url}</a>`
      ),
    event
  )

  var live = (event) =>
    new Date(event.start_time).getTime()
      <= new Date().getTime()
    &&
    new Date(event.end_time || event.start_time).getTime()
      >= new Date().getTime()

  var upcoming = () =>
    varnalab
      .get('events/upcoming')
      .request()
      .then(([res, body]) =>
        body
          .map((event) => format(event))
          .map((event) => (event.live = live(event), event))
      )

  var events = () =>
    varnalab
      .get('events')
      .qs({limit: 100000})
      .request()
      .then(([res, body]) =>
        body
        .filter((event) => new Date(event.start_time) < new Date())
        .map((event) => format(event))
      )

  var members = () =>
    varnalab
      .get('whois/known')
      .request()
      .then(([res, body]) => body)

  return {upcoming, events, members}
}
