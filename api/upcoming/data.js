module.exports = run



const mongo = require('@techspeakers/mongoclient')

const { startOfDayUTC } = require('@techspeakers/dateutils')

async function run() {
  const db = await mongo.connect()
  const cfpcal = db.collection('cfps')

  const today = startOfDayUTC()

  const hits = await cfpcal.find({ deadline: { $gte: today } }).toArray()

  // Sort into ascending order by deadline date
  // (deadlines are Date-s, Math operates on the timestamp integers)
  hits.sort((a,b) => a.deadline - b.deadline )

  // Extra fields

  // Days until the event (0 - it's today, 1 - tomorrow, etc...)
  hits.forEach(e => {
    e.meta = e.meta || {}
    e.meta.daysUntil = Math.round( (startOfDayUTC(e.deadline) - today) / 1000/60/60/24 )
  })

  console.log(hits.length + ' upcoming CFPs')
  return hits
}
