const host = 'https://api.winnipegtransit.com/v3/';
const apiKey = 'api-key=6ijhpcl278IX2xWSPhyS';
const query = 'streets.json?name= Henlow Bay&';
const stops = 'stops.json?street='
let stopsArray = [];
let promises = [];
const mainDiv = document.querySelector('.main-container')

const stopSchedules = stopKeys => {
  for (let key of stopKeys.stops) {

    let fetches = fetch(`${host}stops/${key.key}/schedule.json?${apiKey}`)
      .then(data => data.json());
    promises.push(fetches);
  }

  return promises;
}

const addDataToHtml = jsonData => {

  Promise.all(stopSchedules(jsonData))
    .then(response => {
      console.log(response);
      response.forEach(e => {
        mainDiv.insertAdjacentHTML('beforeend', `
      <div>Name of the stop :${e['stop-schedule'].stop.name} </div>
      <div>Direction :${e['stop-schedule'].stop.direction} </div>
      <div>Cross street name :${e['stop-schedule'].stop['cross-street'].name} </div>   
      `)

        for (let route of e['stop-schedule']['route-schedules']) {

          mainDiv.insertAdjacentHTML('beforeend', `
          <div>Bus time :${route.route.name} </div>
          `)

          for (let bus of route['scheduled-stops']) {
            mainDiv.insertAdjacentHTML("beforeend",
              `<div class = '.last-div'>BUS TIME: ${bus.times.arrival.scheduled}</div>`
            );
          }

        }
      })
    })

}

fetch(`${host}${query}${apiKey}`)
  .then(response => response.json())
  .then(responseData => fetch(`${host}${stops}${responseData.streets[0].key}&${apiKey}`))
  .then(stopsRespose => stopsRespose.json())
  .then(stopsJson => addDataToHtml(stopsJson));