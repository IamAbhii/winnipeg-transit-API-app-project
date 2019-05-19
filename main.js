const host = 'https://api.winnipegtransit.com/v3/';
const apiKey = 'api-key=6ijhpcl278IX2xWSPhyS';
const query = 'streets/1717.json?'
fetch(`${host}${query}${apiKey}`)
  .then((response) => console.log(response.json()));