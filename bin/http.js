
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

  var t = {
    start: (event) => (
      event.time1 = moment(event.start_time).format('LL'),
      event.time2 = moment(event.start_time).format('LLLL').split(',')[0],
      event.time3 = moment(event.start_time).format('LT')
    )
    ,
    links: (event) =>
      event.description = (event.description || '')
        .replace(/\n/gi, '<br>')
        .replace(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
          (url) => `<a href="${url}">${url}</a>`
        )
    ,
    live: (event) => event.live =
      new Date(event.start_time).getTime()
        <= new Date().getTime()
      &&
      new Date(event.end_time || event.start_time).getTime()
        >= new Date().getTime()
    ,
    created: (article) => ((date = new Date(article.date)) =>
      article.url = [
        'blogs',
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        article.slug
      ].join('/')
    )()
    ,
    url: (article) => ((date = new Date(article.date)) => (
      article.time1 = moment(date).format('LL'),
      article.time2 = moment(date).format('LLLL').split(',')[0],
      article.time3 = moment(date).format('LT')
    ))()
    ,
  }

  var upcoming = () =>
    varnalab
      .get('events/upcoming')
      .request()
      .then(([res, body]) => body
        .map((event) => (t.start(event), t.links(event), t.live(event), event))
      )

  var events = () =>
    varnalab
      .get('events')
      .qs({limit: 100000})
      .request()
      .then(([res, body]) => body
        .filter((event) => new Date(event.start_time) < new Date())
        .map((event) => (t.start(event), t.links(event), event))
      )

  var members = () =>
    varnalab
      .get('whois/known')
      .request()
      .then(([res, body]) => body)

  var articles = () =>
    varnalab
      .get('articles')
      .request()
      .then(([res, body]) => body
        .map((article) => (t.created(article), t.url(article), article))
      )

  return {upcoming, events, members, articles}
}
