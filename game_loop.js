//var creature = new require("./creature.js");

function creature(name, current_island, pos_x, pos_y) 
{
    this.name = name;
    this.current_island = current_island;
    this.pos_x = pos_x;
    this.pos_y = pos_y;
}

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

    var c;

    if(islands[config.starting_zone].creatures.length < 5)
    {
        c = new creature("creature" + islands[config.starting_zone].creatures.length,
        config.starting_zone, islands[config.starting_zone].start_x, islands[config.starting_zone].start_y);
        islands[config.starting_zone].creatures.push(c);
    }

    islands[config.starting_zone].creatures.forEach(function(creature)
    {        
        if(Math.random() > 0.4)
        {
            creature.pos_x += 24;
        }
        else
        {
            creature.pos_x -= 24;
        }

        if(Math.random() > 0.4)
        {
            creature.pos_y += 24;
        }
        else
        {
            creature.pos_y -= 24;
        }

        var message = {"Creature": creature.name, "Command": "creature", "Pos_x": creature.pos_x, "Pos_y": creature.pos_y};
        
        islands[config.starting_zone].clients.forEach(function(client)
        {        
            //var message = {"Player": client.user.username, "Command": "log", "Message": "loop"};
            client.broadcastIsland(message);
        });
        
    });
};