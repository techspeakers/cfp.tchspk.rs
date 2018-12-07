module.exports = run



const mongo = require('@techspeakers/mongoclient')

async function run() {
  const db = await mongo.connect()
  const cfpcal = db.collection('cfpcal')

  const today = utcStartOfDay()

  const hits = await cfpcal.find({ start: { $gt: today } }).toArray()

  // Sort into ascending order by deadline date
  hits.sort((a,b) => a.start<b.start ? -1 : a.start>b.start ? 1 : 0 )

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
