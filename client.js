var now = require("performance-now");
var _ = require("underscore");
var { StreamTcp, GdBuffer, addLengthFront } = require('@gd-com/utils')

module.exports = function()
{
    var client = this;

    //These objects will be added at runtime...
    //this.socket = {}
    //this.user = {}

    this.initiate = function()
    {
        const tcpSplit = new StreamTcp()
        client.socket.pipe(tcpSplit).on('data', (data) => 
        {
            var packet = new GdBuffer(data)
            var decoded = packet.getVar()
            //console.log('receive:', decoded)

            var packetToSend = new GdBuffer()
            
            if (decoded.Command == "login")
            {
                User.login(decoded.Player, decoded.Password, function(result, user)
                {
                    if(result)
                    {
                        client.user = user;
                        client.enterIsland(client.user.current_island);
                        packetToSend.putVar({Player: decoded.Player, Command: decoded.Command, Result: true, 
                            Island: client.user.current_island, Pos_x: client.user.pos_x, Pos_y: client.user.pos_y})
                        let toSend = addLengthFront(packetToSend.getBuffer())
                        console.log('Client "' + decoded.Player + '" logged in')
                        client.socket.write(toSend)
                    }
                    else
                    {
                        packetToSend.putVar({Player: decoded.Player, Command: decoded.Command, Result: false})
                        let toSend = addLengthFront(packetToSend.getBuffer())
                        console.log('Client "' + decoded.Player + '" failed to log in')
                        client.socket.write(toSend)
                    }
                });
            }
            else if (decoded.Command == "register")
            {
                User.register(decoded.Player, decoded.Password, function(result, user)
                {
                    if(result)
                    {
                        packetToSend.putVar({Player: decoded.Player, Command: decoded.Command, Result: true})
                        let toSend = addLengthFront(packetToSend.getBuffer())
                        console.log('Client "' + decoded.Player + '" registered')
                        client.socket.write(toSend)
                    }
                    else
                    {
                        packetToSend.putVar({Player: decoded.Player, Command: decoded.Command, Result: false})
                        let toSend = addLengthFront(packetToSend.getBuffer())
                        console.log('Client "' + decoded.Player + '" failed to register')
                        client.socket.write(toSend)
                    }
                });
            }
            else if(decoded.Command == "move")
            {
                packetToSend.putVar(decoded)
                let toSend = addLengthFront(packetToSend.getBuffer())
                console.log('Client "' + decoded.Player + '" moved to x:' + decoded.Pos_x + ', y:' + decoded.Pos_y )
                client.socket.write(toSend)

                client.broadcastRoom(decoded);
            }
            else
            {           
            }
        })

        console.log("Client initiated");
    };

    //Client methods
    this.enterIsland = function(selected_island)
    {
        islands[selected_island].clients.forEach(function(otherClient)
        {
            var packetToSend = new GdBuffer()

            packetToSend.putVar({Player: client.Player, Command: "enter", Pos_x: client.user.pos_x, Pos_y: client.user.pos_y})
            let toSend = addLengthFront(packetToSend.getBuffer())
            //console.log('enter island:', toSend)
        });

        islands[selected_island].clients.push(client);        
    };

    this.broadcastRoom = function(packetData)
    {
        //Update user on server
        client.user.pos_x = packetData.Pos_x
        client.user.pos_y = packetData.Pos_y

        islands[client.user.current_island].clients.forEach(function(otherClient)
        {
            if(otherClient.user.username != client.user.username)
            {
                var packetToSend = new GdBuffer()
                packetToSend.putVar({Player: packetData.Player, Command: "broadcast", Pos_x: packetData.Pos_x, Pos_y: packetData.Pos_y})
                let toSend = addLengthFront(packetToSend.getBuffer())
                //console.log('broadcast:', toSend)
                otherClient.socket.write(toSend)
            }
        });
    };

    //Socket events
    this.data = function(data)
    {
        //console.log("Client data " + data.toString());
    };

    this.error = function(err)
    {
        console.log("Client error " + err.toString());
    };

    this.end = function()
    {
        client.user.save(function(err)
        {
            if(err)
            {
                console.log('Client "' + client.user.username + '" failed to save: ' + err.toString());
            }
            else
            {
                console.log('Client "' + client.user.username + '" saved');
            }
        });
        //islands[client.current_island].clients.erase(client)
        console.log('Client "' + client.user.username + '" disconnected');
    };
};