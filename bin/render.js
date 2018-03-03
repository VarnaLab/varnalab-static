
var fs = require('fs')
var path = require('path')
var util = require('util')
var hogan = require('hogan.js')
var HTTP = require('./http')
var FS = require('./fs')
var meta = require('./meta')
var write = util.promisify(fs.writeFile)


var compile = (type, template) =>
  hogan.compile(
    fs.readFileSync(
      path.resolve(__dirname, `../html/${type}/${template}.html`),
      'utf8'
    )
  )


var layout = [
  'base',
  'header',
  'footer',
  'sidebar',
]
.reduce((all, template) =>
  (all[template] = compile('layout', template), all), {})


var widgets = [
  'whois',
  'temperature',
  'facebook',
  'google',
  'twitter',
  'calendar',
  'map',
  'mobile',
]
.reduce((all, template) =>
  (all[template] = compile('widget', template), all), {})


var content = [
  'event',
]
.reduce((all, template) =>
  (all[template] = compile('content', template), all), {})


var views = [
  'home',
  'about',
  'events',
  'past',
  'members',
  'links',
  'contacts',
  'articles',
  'article',
  'finance',
]
.reduce((all, template) => (
  all[template] = {
    'layout/header': layout.header,
    'layout/sidebar': layout.sidebar,
    'layout/footer': layout.footer,

    'view/content': compile('view', template),

    'widget/whois': widgets.whois,
    'widget/temperature': widgets.temperature,
    'widget/facebook': widgets.facebook,
    'widget/twitter': widgets.twitter,
    'widget/google': widgets.google,
    'widget/calendar': widgets.calendar,
    'widget/map': widgets.map,
    'widget/mobile': widgets.mobile,

    'content/event': content.event,
  },
  all
), {})


var Render = (location, context) => ({
  views: () =>
    Object.keys(views)
      .map((name) => ((partials = views[name]) =>
        write(
          path.join(location, name + '.html'),
          layout.base.render(context, partials),
          'utf8'
        )
      )()),

  events: () => {
    var events = context.events
    var pages = Math.ceil(events.length / 10)

    var partials = views.past
    var files = []

    return Array(pages).fill(true)
      .map((value, index) => {
        var page = index + 1

        if (page === 1) {
          delete context.prev
          context.next = page + 1
        }
        else if (page === pages) {
          context.prev = page - 1
          delete context.next
        }
        else {
          context.prev = page - 1
          context.next = page + 1
        }

        context.events = events.slice(index * 10, index * 10 + 10)

        return write(
          path.join(location, '/events/', `${page}.html`),
          layout.base.render(context, partials),
          'utf8'
        )
      })
  },

  articles: () => {
    var articles = context.articles
    var partials = views.article

    return articles
      .map((article) => (
        context.article = article,
        write(
          path.join(location, '/articles/', `${article.slug}.html`),
          layout.base.render(context, partials),
          'utf8'
        )
      ))
  }
})


module.exports = async (config, location, force) => {

  if (config.fs) {
    var varnalab = FS(config, force)
    var context = Object.assign({
      path: config.url.path,
      api: config.url.api,
      meta: meta.defaults(config),
    }, varnalab)
  }
  else {
    var varnalab = HTTP(config)
    var context = {
      path: config.url.path,
      api: config.url.api,
      meta: meta.defaults(config),
      upcoming: await varnalab.upcoming(),
      events: await varnalab.events(),
      members: await varnalab.members(),
      articles: await varnalab.articles(),
      cashbox: await varnalab.cashbox(),
    }
  }

  // only when files are modified
  if (Object.keys(context).length > 3) {
    var render = Render(location, context)
    return Promise.all(
      render.views()
        .concat(render.events())
        .concat(render.articles())
      )
  }
}
