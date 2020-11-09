var utils = {
  url: ({url: {scheme, host, path}}, endpoint) =>
    scheme + '://' + host + path.replace(/\/$/, '') + endpoint,

  description: (string) => string
    .replace(/<(?:.|\n)*?>/gm, '')
    .replace(/&(nbsp|amp|quot|lt|gt);/gm, '')
    .replace(/\n/gm, '')
    // .slice(0, 150) + '...'
}

var defaults = [
  {"charset": "utf-8"},
  {"name": "viewport", "content": "width=device-width, initial-scale=1"},
  {"name": "theme-color", "content": "#000"},
  // {"name": "author", "content": "Simeon Velichkov"},
  {"name": "copyright", "content": "VarnaLab"},
  {"name": "robots", "content": "follow,index"},
  {"name": "title", "content": "VarnaLab"},
  {"name": "keywords", "content": "varnalab, hackerspace, varna, bulgaria", "lang": "en-us"},
  {"name": "description", "content": "VarnaLab"},
]

module.exports = {
  event: (event) => [
    {property: 'og:title', content: event.name},
    {property: 'og:description', content: utils.description(event.description)},
    {property: 'og:image', content: event.photo},
    {property: 'og:image:alt', content: 'Event Cover'},
    {property: 'og:url', content: 'https://www.facebook.com/events/' + event.id},
    {property: 'og:site_name', content: 'VarnaLab'},
    {property: 'og:type', content: 'website'},
    {name: 'twitter:card', content: event.photo},
    {name: 'twitter:image:alt', content: 'VarnaLab'},
  ],
  defaults: (config) => defaults.concat([
    {property: 'og:title', content: 'VarnaLab'},
    {property: 'og:description', content: 'VarnaLab - free space for sharing knowledge, ideas and technologies.'},
    {property: 'og:image', content: utils.url(config, '/images/meta-cover.png')},
    {property: 'og:image:alt', content: 'VarnaLab Cover'},
    {property: 'og:url', content: utils.url(config, '/')},
    {property: 'og:site_name', content: 'VarnaLab'},
    {property: 'og:type', content: 'website'},
    // TODO - EN version of the image
    {name: 'twitter:card', content: utils.url(config, '/images/meta-cover.png')},
    {name: 'twitter:image:alt', content: 'VarnaLab'},
  ])
}
