var { StreamTcp, GdBuffer, addLengthFront } = require('@gd-com/utils')
var Creature = new require("./Models/creature.js");

exports.run = function()
{
    if(islands.length < 1)
    {
        return;
    }

    islands[config.starting_zone].clients.forEach(function(client)
    {        
        //var message = {"Player": client.user.username, "Command": "log", "Message": "loop"};
        //client.broadcastIsland(message);
    });

    if(islands[config.starting_zone].creatures.length < 50)
    {
        let c = new Creature("creature" + islands[config.starting_zone].creatures.length,
        config.starting_zone, islands[config.starting_zone].start_x, islands[config.starting_zone].start_y);
        islands[config.starting_zone].creatures.push(c);
    }

    var messages = []

    islands[config.starting_zone].creatures.forEach(function(creature)
    {        
        messages.push(creature.move())
    });

    var packetToSend = new GdBuffer()
    packetToSend.putVar(messages)
    var toSend = addLengthFront(packetToSend.getBuffer())

    islands[config.starting_zone].clients.forEach(function(client)
    {
        client.socket.write(toSend);
    });
};