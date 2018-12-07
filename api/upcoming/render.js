const parseEvent = require('../parseevent')

const month = (date) => {
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][
    typeof date === 'object' ? date.getUTCMonth() : date
  ]
}

const day = (date) => {
  return String(typeof date === 'object' ? date.getUTCDate() : date).padStart(2, '0')
}

const renderEventListItem = (event) => {
  const { deadline, url, location, title, twitter } = event

  return `<li>
    <a class="t" href="${url||''}" target="_blank">
      <time class="date" datetime="${deadline}">${month(deadline)}/${day(deadline)}</time>
      <span class="event" title="${title}">${title}</span>
      <span class="location">${location}</span>
    </a>
  </li>`
}

module.exports = (events) => {
  const eventList = events.map(e => renderEventListItem(e)).join('')

  let template = require('fs').readFileSync(`${__dirname}/../../templates/main.html`).toString()

  let res = template
    .replace('<!--TITLE-->','Upcoming CFP deadlines')
    .replace('<!--BODY-->',`<ul>${eventList}</ul>`)

  return res
}
