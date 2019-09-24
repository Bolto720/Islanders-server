var mongoose = require('mongoose');
const gamedb = require("mongoose");

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    sprite: String,
    current_island: String,
    pos_x: Number,
    pos_y: Number
});

userSchema.statics.register = function(username, password, cb)
{
    var new_user = new User({
        username: username,
        password: password,

        sprite: "spr_player",
        current_island: islands[config.starting_zone].id,
        pos_x: islands[config.starting_zone].start_x,
        pos_y: islands[config.starting_zone].start_y
    });

    new_user.save(function(err)
    {
        if(!err)
        {
            cb(true);
        }
        else
        {
            cb(false);
        }
    });
};

userSchema.statics.login = function(username, password, cb)
{
    User.findOne({username: username}, function(err, user)
    {
        if(!err && user)
        {
            if(user.password == password)
            {
                if(user.pos_x == null)
                {
                    user.pos_x = islands[config.starting_zone].start_x;
                }

                if(user.pos_y == null)
                {
                    user.pos_y = islands[config.starting_zone].start_y;
                }

                cb(true, user);
            }
            else
            {
                cb(false, null);
            }
        }
        else
        {
            cb(false, null);
        }
    });
};

module.exports = User = gamedb.model('User', userSchema);