testFunc = function(){
  return "TEST FUNCTION RUNNING"
}

getWesternCharts = async function() {
  let chartData = "";
  console.log("Calling get western charts")
  var api = 'western_chart_data';
  var userId = process.env.ASTROLOGY_API_USER_ID;
  var apiKey = process.env.ASTROLOGY_API_KEY;
  var userData = {
      day: 6,
      month: 1,
      year: 2000,
      hour: 7,
      min: 45,
      lat: 19.132,
      lon: 72.342,
      tzone: 5.5,
  };

  var auth = "Basic " + new Buffer(userId + ":" + apiKey).toString("base64");
  
/* SAMPLE ASYNC
  async function logMovies() {
    const response = await fetch("http://example.com/movies.json");
    const movies = await response.json();
    console.log(movies);
  }
*/
  await fetch("https://json.astrologyapi.com/v1/"+api, {
    Method: 'POST',
    Headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
      'authorization': auth
    },
    Body: JSON.stringify(userData),
    Cache: 'default'
  }).then(response => {
      chartData = /*response.json()*/"HELLOOOOOO";          
      console.log(response);
  }).catch(error => {
      //handle error
  }); 
  return chartData;
}
module.exports = {
    getWesternCharts: getWesternCharts,
    testFunc: testFunc
}
