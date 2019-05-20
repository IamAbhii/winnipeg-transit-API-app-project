const host = 'https://api.winnipegtransit.com/v3/';
const apiKey = 'api-key=6ijhpcl278IX2xWSPhyS';
const query = 'streets.json?name=henlow bay&';
const stops = 'stops.json?street='
let stopsArray;
let promises = [];

const stopSchedules = stopKey => {
  return fetch(`${host}stops/${stopKey}/schedule.json?${apiKey}`)
}

const promise = json => {
  json.stops.forEach(e => {
    promises.push(stopSchedules(e.key))
  })
  return promises;
}

const addDataToHtml = jsonData => {
  Promise.all(promise(jsonData))
    .then((response) => {
      stopsArray = response.map(e => e.json())
    })


}

fetch(`${host}${query}${apiKey}`)
  .then((response) => response.json())
  .then((responseData) => fetch(`${host}${stops}${responseData.streets[0].key}&${apiKey}`))
  .then((stopsRespose) => stopsRespose.json())
  .then((stopsJson) => addData(stopsJson))