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


/**
 * Function to repeatetly send rocketChatClient.channels.list()
 * to iterate over result pagination (default max count = 100)
 * until final page is received
 * @param {Integer} offset - Optional offset can be passed
 */
function sendChannelsListApiRequest(offset = 0){
    var count = 100;

    // Actual function of REST client to get the available public channels
    rocketChatClient.channels.list({"offset":offset, "count":count}, function (err, body) {
        if (err) {
            error(err);
        }

        var total = body.total,
            channels = body.channels;

        // Iterate over each channel (asynchronously to not start another request until iteration is completed)
        async.eachSeries(channels, function(channel, cb){
            // Check if channel is a default one
            if (!channel.default) {
                channelArray.push(channel._id);
            } else {
                channelArrayExcludes.push(channel._id);
            }

            // Callback to let eachSeries() know about current channel processing
            return cb(null);
        },function(err) {
            var channelsTotal = channelArray.length + channelArrayExcludes.length;

            // Iteration completed
            console.log("Added " + channelArray.length + " channels from this request (" + channelArray.length + " so far)...");
            // Check if there more channels that needs to be processed (with another API request)
            if (channelsTotal < total) {
                sendChannelsListApiRequest({"offset":channelsTotal, "count":count});
            } else if(channelsTotal === total){
                console.log('Success! Found ' + channelArray.length + ' channels in total.');
                console.log(channelArray);
            }
        });
    });
}
var packagejson = require('./package.json');

// Empty arrays that will hold the objects
var channelArray = [],
    channelArrayExcludes = [],
    userArray = [],
    userArrayExcludes = [],
    roomsArray = [];

program
    .version(packagejson.version)
    .description(packagejson.description)
    .option('-r, --rooms', 'Purge all (public and private) rooms')
    .option('-u, --users', 'Purge all (active and inactive) users')
    .option('-au, --admin-user <username>', 'Admin user that\'s excluded from the purge')
    .parse(process.argv);

// Load configuration object for RocketChat API from JSON
var config = require('./config.json');

// Create client
var rocketChatClient = new RocketChatClient(config);

// Check if --admin-user was supplied
if (!program.adminUser) {
    program.outputHelp();
    error('--admin-user required');
}

// Authenticate using admin credentials stored in config object
rocketChatClient.authentication.login(config.username, config.password, function(err, body) {
	if (!err) {
        sendChannelsListApiRequest();
    } else {
        error(err);
	}
})
