var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});


server.route({
	method: 'GET',
	path:'/{param*}',
	handler: {
		directory: {
			path: "public",
			listing: true,
			index: false
		}
	}
});

server.route({
	method: 'GET',
	path:'/shared/{param*}',
	handler: {
		directory: {
			path: "shared",
			listing: true,
			index: false
		}
	}
});

// Add the route
server.route({
    method: 'GET',
    path:'/flickr', 
    handler: function (request, reply) {
		var credentials = require('./shared/credentials.js'),
			httpRequest = require('request'),
			flickr = {
				"url": 'https://api.flickr.com/services/rest/',
				"qs": {
					"method": 'flickr.photos.search',
					"api_key": credentials.flickr.api_key,
					"tags": 'seabus',
					"format": 'json',
					"nojsoncallback": 1
				},
				"json": true
			};
		httpRequest(flickr, function (error, incomingMessage, response) {
			if (!error && incomingMessage.statusCode === 200) {
				reply(response); // Browser output
				console.log("Command window");
			}
		});
    }
});



// Start the server
server.start(function () {
	console.log('Server running at ' + server.info.uri);
});