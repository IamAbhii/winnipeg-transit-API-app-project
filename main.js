const host = 'https://api.winnipegtransit.com/v3/';
const apiKey = 'api-key=6ijhpcl278IX2xWSPhyS';
const query = 'streets.json?name= pembina highway&';
const stops = 'stops.json?street='
let stopsArray = [];
let promises = [];
const mainDiv = document.querySelector('.main-container')
let counter = 1;
const stopSchedules = stopKeys => {
  for (let key of stopKeys.stops) {

    let fetches = fetch(`${host}stops/${key.key}/schedule.json?&max-results-per-route=2&${apiKey}`)
      .then(data => data.json());
    promises.push(fetches);
    counter++
    if (counter > 2) {
      break
    }
  }

  return promises;
}

const addDataToHtml = jsonData => {

  Promise.all(stopSchedules(jsonData))
    .then(response => {
      console.log(response);
      response.forEach(e => {
        mainDiv.insertAdjacentHTML('beforeend', `
      <div class ='first-div'>Name of the stop :${e['stop-schedule'].stop.name} </div>
      <div>Direction :${e['stop-schedule'].stop.direction} </div>
      <div>Cross street name :${e['stop-schedule'].stop['cross-street'].name} </div>   
      `)

        for (let route of e['stop-schedule']['route-schedules']) {

          mainDiv.insertAdjacentHTML('beforeend', `
          <div>Route number:${route.route.name} </div>
          `)

          for (let bus of route['scheduled-stops']) {
            mainDiv.insertAdjacentHTML("beforeend",
              `<div >BUS TIME: ${bus.times.arrival.scheduled}</div>`
            );
          }

        }

      })
      counter = 0
    })

}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(function (registration) {
      console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function (error) {
      console.log('Service worker registration failed, error:', error);
    });
}


fetch(`${host}${query}${apiKey}`)
  .then(response => response.json())
  .then(responseData => fetch(`${host}${stops}${responseData.streets[0].key}&${apiKey}`))
  .then(stopsRespose => stopsRespose.json())
  .then(stopsJson => addDataToHtml(stopsJson));