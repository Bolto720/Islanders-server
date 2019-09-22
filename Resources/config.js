var args = require('minimist')(process.argv.slice(2));
var extend = require('extend');

var environment = args.env || "test";

var common_conf = {
    name: "Islanders",
    version: "0.0.1",
    environment: environment,
    max_player: 20,
    data_paths: {
        items: __dirname + "/GameData/Items",
        islands: __dirname + "/GameData/Islands"
    },
    starting_zone: "startIsland"
};

var conf = {
    production: {
        ip: args.ip || "  0.0.0.0",
        port: args.port || 8081,
        database: "mongodb://127.0.0.1/Islanders_Prod"
    },
    test: {
        ip: args.ip || "  0.0.0.0",
        port: args.port || 8082,
        database: "mongodb://127.0.0.1/Islanders_Test"
    }
};

extend(false, conf.production, common_conf);
extend(false, conf.test, common_conf);

module.exports = config = conf[environment];