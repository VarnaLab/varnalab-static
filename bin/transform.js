
var moment = require('moment')
moment.locale('bg')


module.exports = () => {

  var events = (events) => {
    events.forEach((event) => {
      // start
      event.time1 = moment(event.start_time).format('LL'),
      event.time2 = moment(event.start_time).format('LLLL').split(',')[0],
      event.time3 = moment(event.start_time).format('LT')
      // links
      event.description = (event.description || '')
        .replace(/\n/gi, '<br>')
        .replace(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
          (url) => `<a href="${url}">${url}</a>`
        )
      // live
      event.live =
        new Date(event.start_time).getTime()
          <= new Date().getTime()
        &&
        new Date(event.end_time || event.start_time).getTime()
          >= new Date().getTime()
      // cover
      event.cover_desktop = event.cover_desktop || 'https://i.imgur.com/VC5g7gp.jpg'
    })
    return events
  }

  var articles = (articles) => {
    articles.forEach((article) => {
      var date = new Date(article.date)
      // created
      article.url = [
        'blogs',
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        article.slug
      ].join('/')
      // url
      article.time1 = moment(date).format('LL'),
      article.time2 = moment(date).format('LLLL').split(',')[0],
      article.time3 = moment(date).format('LT')
    })
    return articles
  }

  var cashbox = (entries) => {
    entries = entries
    // filter out removed items
    .filter((item) => /^\d+$/.test(item['Движение номер']))
    .map((item) => ({
      id: parseInt(item['Движение номер']),
      date: item['Дата'],
      type:
        item['Тип'] === 'Приход' ? 'income' :
        item['Тип'] === 'Разход' ? 'expense' : '',
      amount: parseFloat(item['Стойност']),
      reason: item['Основание'],
      category: item['Категория'],
      notes: item['Забележки'],
      admin: item['Контрагент'],
    }))
    .sort((a, b) => b.id - a.id)

    var income = entries
      .filter((entry) => entry.type === 'income')
      .reduce((sum, entry) => sum += entry.amount, 0.0)

    var expense = entries
      .filter((entry) => entry.type === 'expense')
      .reduce((sum, entry) => sum += entry.amount, 0.0)

    return {
      entries,
      total: {
        income: income.toFixed(2),
        expense: expense.toFixed(2),
        current: (income - -expense).toFixed(2)}
    }
  }

  return {events, articles, cashbox}
}
