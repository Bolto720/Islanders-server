require(__dirname + '/Resources/config.js');
var fs = require('fs');
var net = require('net');
require("./packet.js");

//Load initializers
var init_files = fs.readdirSync(__dirname + "/Initializers");
init_files.forEach(function(initFile)
{
    console.log("Loading initializer: " + initFile);
    require(__dirname + "/Initializers/" + initFile);
});

//Load models
var model_files = fs.readdirSync(__dirname + "/Models");
model_files.forEach(function(modelFile)
{
    console.log("Loading model: " + modelFile);
    require(__dirname + "/Models/" + modelFile);
});

//Load islands
islands = {};
var island_files = fs.readdirSync(config.data_paths.islands);
island_files.forEach(function(islandFile)
{
    console.log("Loading island: " + islandFile);
    var island = require(config.data_paths.islands + '/' + islandFile);
    islands[island.id] = island;
});

//Start server
net.createServer(function(socket)
{
    console.log("Socket connected");

    var c_inst = new require("./client.js");
    var thisClient = new c_inst();

    thisClient.socket = socket;
    thisClient.initiate();

    socket.on("error", thisClient.error);
    socket.on("end", thisClient.end);
    socket.on("data", thisClient.data);
}).listen(config.port);

console.log("Initialize completed, server running on port " + config.port 
    + " for environment " + config.environment);