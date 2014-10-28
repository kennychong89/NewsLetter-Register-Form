// putting it all together
var server = require("./server");
var router = require("./router");

server.start(new router());
