
var http = require('http');
var express = require('express');
var app = express();
var geoip = require('geoip-lite');
app.set('port', (process.env.PORT || 5000))

//Connect to the API URL api.openweathermap.org/data/2.5/weather?q={city name},{country code}
// key  ::  b0a4f9bb5260d1042b6aa08ab71caff8

app.get('/', function (req, res) {
	//calculate IP to city
	var ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log(ip);
	var geo=geoip.lookup(ip);
	console.log(geo.city);
	var city= geo.city;	
	
    var request = http.get('http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=b0a4f9bb5260d1042b6aa08ab71caff8', function(response) {
    var body = '';
	    
    //Read the data
    response.on('data', function(chunk) {
        body += chunk;
    });

    response.on('end', function() {
        if (response.statusCode === 200) {
            try {
                //Parse the data
                		var weatherAPI = JSON.parse(body);
           
				var result = weatherAPI.main.temp-273.15;
				console.log("temp:::::"+result);
				var result1= weatherAPI.main.pressure;
				var result3=weatherAPI.main.humidity;
				console.log("temp:::::"+result);
				console.log("pressure:::::"+result1);
		    		console.log("humidity:::::"+result3);
				res.end('Temperature:::::'+result+'ºC\nPressure::::'+result1+' mb\nHumidity::::'+result3+' %');
		  
            } catch(error) {
                //Parse error
                printError(error);
            }
        } else {
            //Status Code error
            printError({message: 'There was an error getting the weather from ' + city + '. (' + http.STATUS_CODES[response.statusCode] + ')'});
        }
    })
});
//Connection error
request.on('error', function (err) {
printError(err);
});
});
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})


