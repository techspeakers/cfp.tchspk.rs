const cal = require('@techspeakers/json-calendar')
const mongo = require('@techspeakers/mongoclient')

//run()

async function run() {
  const calendarUrl = process.env['CALENDAR_URL']

  if (!calendarUrl) return console.error('No CALENDAR_URL supplied!')

  try {
    const caldata = await cal.fromUrl(calendarUrl)
    console.log(caldata.events ? `${caldata.events.length} events tracked` : '')

    const db = await mongo.connect()
    console.log('Database open.')

    const cfpcal = db.collection('cfpcal')
    console.log('Opened `cfpcal` collection...')

    await cfpcal.deleteMany({})
    await cfpcal.insertMany(caldata.events, {})

    console.log('Exported CFP calendar events to the central TS database.')
    return caldata.events
  }
  catch (e) {
    console.error(e)
  }
}


module.exports = (req, res) => {
  run().then(data => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'OK',
      events: data.length
    }))
  })
}
