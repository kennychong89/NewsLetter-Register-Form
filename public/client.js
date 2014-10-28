/*
* A simple JavaScript HTTP request/response to the server.
*/

/*
* We will call this function to send request back to server
*/
function sendRequest(options, callback) {
	var request = new XMLHttpRequest();
	request.open(options.method || "GET", options.pathname, true);

	request.addEventListener("load", function() {
		if (request.status < 400)
			callback(null, request.responseText);
		else
			callback(new Error("Request failed: " + request.statusText));
	});

	request.addEventListener("error", function() {
			callback(new Error("Network error"));
	});

	request.send(options.body || null);
}

var form = document.querySelector("#register");

form.addEventListener("submit", function(event) {
	event.preventDefault();

	// retrieve values from form and create an object we can convert to
	// JSON data
	var firstname = form.elements.firstname.value;
	var lastname = form.elements.lastname.value;
	var email = form.elements.email.value;

	// should have some form validation here, but assume given input
	// is valid for now
	isInputBlank(firstname, lastname, email);
	isEmailValid(email);

	var interestChkList = retrieveInterests();

	var dataObject = {
		"firstName" : firstname,
		"lastName"	: lastname,
		"email"		: email,
		"interests" : interestChkList
	};

	// stringify the object 
	var jsonObject = JSON.stringify(dataObject);
	
	var requestObject = {
		pathname: "/registered",
		method: "POST",
		body: jsonObject
	};

	sendRequest(requestObject, function(error, response) {
		if (error) 
			reportError(error)
		else {
			// do something here....
			// the server should send back a page with a confirmation
			
			var elementNode = document.createElement("p");
			elementNode.appendChild(document.createTextNode(response));
			document.body.replaceChild(elementNode, form);
			form.reset();
			
			//window.location.replace(response);
		}
	});

	function retrieveInterests() {
		var interests = form.elements.interests;
		var interestChked = [];

		for (var i = 0; i < interests.length; i++) {
			if (interests[i].checked) {
				interestChked.push(interests[i].value);
			}
		} 
		
		return interestChked;
	}
});

function reportError(error) {
	if (error)
		alert(error.toString());
}

/*
* TO-DO
* Checks to see if first name, last name, and e-mail are 
* blank.
*/
function isInputBlank(fields) {
	return false;
}

/*
* TO-DO
* Validates e-mail.
*/
function isEmailValid(email) {
	return false;
}




