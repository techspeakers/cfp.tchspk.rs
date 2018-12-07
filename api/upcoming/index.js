const mongo = require('@techspeakers/mongoclient')

//run()

async function run() {
  const db = await mongo.connect()
  const cfpcal = db.collection('cfpcal')

  const today = utcStartOfDay()

  const hits = await cfpcal.find({ start: { $gt: today } }).toArray()

  console.log(hits.length + ' upcoming CFPs')
  return hits
}

function utcStartOfDay(date) {
  const d = date && date instanceof Date ? date : new Date()
    d.setUTCHours(0)
    d.setUTCMinutes(0)
    d.setUTCSeconds(0)
    d.setUTCMilliseconds(0)

  return d
}

module.exports = (req, res) => {
  run().then(data => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'OK',
      hits: data
    }))
  })
}
