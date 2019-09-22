var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

module.exports = gamedb = mongoose.connect(config.database, {useNewUrlParser: true});


//module.exports = gamedb = mongoose.createConnection(config.database)