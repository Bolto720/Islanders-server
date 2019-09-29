var { GdBuffer, addLengthFront } = require('@gd-com/utils')
var Creature = require("./Models/creature.js");

exports.run = function()
{
    if(islands.length < 1)
    {
        return;
    }
    
    if(islands[config.starting_zone].creatures.length < 500)
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

    islands[config.starting_zone].clients.forEach(function(client)
    {        
        var packetToSend = new GdBuffer()
        var clientMessages = []

        messages.forEach(function(message)
        {
            if(client.isInVisibleArea(message.Pos_x, message.Pos_y))
            {                
                clientMessages.push(message)
            }
        });
        
        packetToSend.putVar(clientMessages)
        var toSend = addLengthFront(packetToSend.getBuffer())
        client.socket.write(toSend);
    });

    // islands[config.starting_zone].clients.forEach(function(client)
    // {
    //     client.socket.write(toSend);
    // });
};