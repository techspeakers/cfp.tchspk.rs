module.exports = (e) => {
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
  let url = e.description.match(/http[s]?\:\/\/\S+/)

  // Is there an URL in the description?
  let twitter = e.description.match(/(?:^|\s)(\@\w+)/)

  // Match place and date
  let location = e.summary.match(/\(([^\)]+)\)/)
  location = location ? location[1] : ''
  console.log(location)

  // Separate place & date
  let date, place

  if (location) {
    date = location.match(/(?:January|February|March|April|May|June|July|September|October|November|December)\s\d+-(?:(?:January|February|March|April|May|June|July|September|October|November|December)\s)\d+?/)
    place = location.slice(location.indexOf(',')+1, -1).trim()
  }

  return ({
    title, event, url, twitter, location, date, place
  })
}
