const cal = require('@techspeakers/json-calendar')
const mongo = require('@techspeakers/mongoclient')

const parseEvent = require('../parseevent')



async function run() {
  const calendarUrl = process.env['CALENDAR_URL']

  if (!calendarUrl) return console.error('No CALENDAR_URL supplied!')

  try {
    const caldata = await cal.fromUrl(calendarUrl)
    if (caldata.events) console.log(`${caldata.events.length} events on calendar`)

    const db = await mongo.connect()
    console.log('Database open.')


    // Dump the verbatim calendar data (just for safekeeping)
    const cfpcal = db.collection('cfpcal')
    console.log('Opened `cfpcal` collection...')

    await cfpcal.deleteMany({})
    await cfpcal.insertMany(caldata.events, {})

    console.log('Backed up CFP calendar events in the central TS database.')


    // Preprocess & save the CFP calendar data in the DB
    const parsed = caldata.events.map(e => parseEvent(e))
    console.log(`Parsed & processed ${parsed.length} events`)

    const cfpdb = db.collection('cfps')
    console.log('Opened `cfps` collection...')

    //TODO: instead of simply overwriting the db sync/update events
    //      based on the entry's lastModified date (also perhaps log changes)
    await cfpdb.deleteMany({})

    await cfpdb.insertMany(parsed, {})

    return parsed
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
