/* 
*  A simple node.js http server that will handle request and response from clients.
*  It will be used to allow clients to register for monthly newsletters, 'nodetoday'.
*/
var http = require("http");
var url = require("url");
var fs = require("fs");
var ecstatic = require("ecstatic");
var fileServer = ecstatic({ root: "./public"});

function start(router) {
	/*
	* Handles request and response from client.
	*/
	function onRequest(request, response) {
		// fill out a simple 'hello world'.
		/*
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.write("Hello World");
		res.end();
		*/
		if (!router.resolve(request, response))
			fileServer(request, response);
	} 

	/*
	* Route given a form request submission. 
	* This should send back a confirmation page, indicating whether the request was sucessful or unsucessful.
	*/
	router.add("POST", /^\/registered$/, function(request, response) {
		readStreamAsJSON(request, function(error, formdata) {
			if (error) {
				respond(response, 400, error.toString());
			} else {
				// simple response, should do more later
				respond(response, 200, "Thank you! You are now registered for our monthly newsletter.", "text/html");
			}
		});
	});

	function readStreamAsJSON(stream, callback) {
		var data = "";

		stream.on("data", function(chunk) {
			data += chunk;
		});

		stream.on("end", function() {
			var result, error;

			try {
				result = JSON.parse(data);
			} catch (e) {
				error = e;
			}

			callback(error, result);
		});

		stream.on("error", function(error) {
			callback(error);
		});
	}

	/*
	* Helper function that writes the response's header and data.
	*/
	function respond(response, status, data, type) {
		response.writeHead(status, {
			"Content-Type": type || "text/plain"
		});

		response.end(data);
	}
	
	http.createServer(onRequest).listen(8000);
	console.log("Server has started");
}

exports.start = start;