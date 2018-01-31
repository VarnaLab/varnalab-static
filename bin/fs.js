
var fs = require('fs')
var transform = require('./transform')()


// varnalab-api
var upcoming = (events) => {
  var now = new Date().getTime()
  var upcoming = []

  for (var event of events) {
    var end = new Date(event.end_time || event.start_time).getTime()
    if (end >= now) {
      upcoming.push(event)
    }
    else {
      break
    }
  }

  return upcoming
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
}


module.exports = (config) => {

  var modified = Object.keys(config.fs)
    .some((file) => fs.statSync(config.fs[file]).mtimeMs > Date.now() - (1000 * 60 * 10))

  if (modified) {
    var articles = require(config.fs.articles)
    var events = require(config.fs.events)
    var members = require(config.fs.members)
    var cashbox = require(config.fs.cashbox)

    return {
      upcoming: transform.events(upcoming(events)),
      events: transform.events(
        events.filter((event) => new Date(event.start_time) < new Date())),
      articles: transform.articles(articles),
      members,
      cashbox: transform.cashbox(cashbox),
    }
  }
}
