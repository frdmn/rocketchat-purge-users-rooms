var fs = require('fs'),
    RocketChatApi = require('rocketchat').RocketChatApi,
    RocketChatClient = require('rocketchat').RocketChatClient,
    async = require('async'),
    program = require('commander');


/**
 * Write (success) messages to console and exit the process with
 * error code 0
 * @param  {String} message - String that holds the message to print
 * @return {Object} - Return with error code 0
 */
function success(message){
    console.log(message);
    return process.exit(1);
}

var packagejson = require('./package.json');

program
    .version(packagejson.version)
    .description(packagejson.description)
    .option('-r, --rooms', 'Purge all (public and private) rooms')
    .option('-u, --users', 'Purge all (active and inactive) users')
    .parse(process.argv);

// Load configuration object for RocketChat API from JSON
var config = require('./config.json');

// Create client
var rocketChatClient = new RocketChatClient(config);

// Authenticate using admin credentials stored in config object
rocketChatClient.authentication.login(config.username, config.password, function(err, body) {
	if (!err) {
		success('authenticated');
	} else {
        error(err);
	}
})
