const { startOfDayUTC } = require('@techspeakers/dateutils')

const tzCorrect = function(d) {
  const tzoffset = new Date().getTimezoneOffset()*60*1000
  return new Date(d - tzoffset)
}

module.exports = (e) => {
  const start = tzCorrect(e.start)
  const end = tzCorrect(e.end ? e.end : e.start.getTime()+24*60*60*1000)
  const lastModified = new Date(e.lastmodified)

  // Deadline date
  // CFP calendar entries are full-day events
  // During parsing these dates are interpreted in the current timezone,
  // we need to correct these to UTC time before we store them in the DB
  let deadline = tzCorrect(startOfDayUTC( new Date((end.getTime()/2 + start.getTime()/2) )))

  // Length of the event in days
  let days = Math.round( (end - start) / 1000/60/60/24 )

  let title = e.summary.replace(/\([^\)]*\)/g,'').trim()
  // Clean extra info from title

  // If "CFP" or "CFS' is not specified in the title itself, add it
  // (call for proposals/participation/submissions)
  if (!~title.toUpperCase().indexOf('CFP')
    && !~title.toUpperCase().indexOf('CFS')
  ) title+=' CFP'

  // Conf name without the "CFP" part
  let event = title.replace(/\s+CFP/,'').trim()

  // Is there an URL in the description?
  let url = firstMatch(/http[s]?\:\/\/\S+/, e.description)

  // Is there an URL in the description?
  let twitter = firstMatch(/(?:^|\s)(\@\w+)/, e.description)

  // Match place and date
  let location = firstMatch(/\(([^\)]+)\)/, e.summary)

  // Separate place & date
  let date, place

  if (location) {
    date = firstMatch(
            /(?:January|February|March|April|May|June|July|September|October|November|December)\s\d+(?:\s?-\s?(?:(?:(?:January|February|March|April|May|June|July|September|October|November|December)\s)?)\d+)?/,
            location
          )

    place = location.slice(location.indexOf(',')+1, -1).trim()
  }

  return ({
    _id: e.uid,

    deadline,

    title, event, url, twitter, location, date, place,

    days,

    lastModified,

    calendarEntry: {
      start,
      end,
      summary: e.summary,
      description: e.description,
      location: e.location,
    }
  })
}

function firstMatch(rx, string) {
  const m = string.match(rx)

  // no captures but full pattern match
  if (m && m[0] && m.length === 1) return m[0]

  // First capture
  return m && m[1] ? m[1] : undefined
}
