module.exports = run



const mongo = require('@techspeakers/mongoclient')

async function run() {
  const db = await mongo.connect()
  const cfpcal = db.collection('cfps')

  const hits = await cfpcal.find({ daysUntil: { $gte: 0 } }).toArray()

  // Sort into ascending order by deadline date
  // (deadlines are Date-s, Math operates on the timestamp integers)
  hits.sort((a,b) => a.deadline - b.deadline )

  console.log(hits.length + ' upcoming CFPs')
  return hits
}
