const { send } = require('micro')
const run = require('./data')

module.exports = async (req, res) => {
  const q = require('url').parse(req.url, true).query || {}
  const format = !q.format || q.format === '$format' ? '' : q.format

  const data = await run()

  // Send as JSON
  if (format === 'json') {
    send(res, 200, {
      status: 'OK',
      format: format,
      hits: data
    })

  // Send as webpage
  } else {
    const rendered = require('./render')(data)
    send(res, 200, rendered)

  }
}
