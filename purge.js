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
 * Function to write error message to console and also exit the process
 * with error code 1
 * @param  {String|Object} err - Object that holds the error message
 * @param  {Integer} code - Optional status code to exit with (defaults to 1)
 * @return {Object} process - End process with exit code
 */
function error(err, code = 1){
    console.log("error: ", err);
    return process.exit(code);
}

/**
 * Function to repeatetly send rocketChatClient.channels.list()
 * to iterate over result pagination (default max count = 100)
 * until final page is received
 * @param {Integer} offset - Optional offset can be passed
 */
function listChannelsApi(offset = 0, callback){
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
            console.log("Added " + channelArray.length + " to the queue...");
            // Check if there more channels that needs to be processed (with another API request)
            if (channelsTotal < total) {
                listChannelsApi({"offset":channelsTotal, "count":count}, function(){
                    return callback(true);
                });
            } else if(channelsTotal === total){
                console.log('Success! Found ' + channelArray.length + ' channels in total.');

                channelArray.forEach(channel => {
                    deleteChannelApi(channel);
                });

                return callback(true);
            }
        });
    });
}

/**
 * Function to delete a certain public channel
 * @param {*} id - id of the channel to delete
 * @return {bool} result
 */
function deleteChannelApi(id){
    rocketChatClient.channels.delete(id, function (err, body) {
        if (!err) {
            console.log('Deleted channel #' + id);
            return true;
        } else {
            console.log('Couldn\'t delete channel #' + id);
            return false;
        }
    })
}

/**
 * Function to repeatetly send rocketChatClient.groups.list()
 * to iterate over result pagination (default max count = 100)
 * until final page is received
 * @param {Integer} offset - Optional offset can be passed
 */
function listGroupsApi(offset = 0, callback){
    var count = 100;

    // Actual function of REST client to get the available private groups
    rocketChatClient.groups.list({"offset":offset, "count":count}, function (err, body) {
        if (err) {
            error(err);
        }

        var total = body.total,
            groups = body.groups;

        // Iterate over each group (asynchronously to not start another request until iteration is completed)
        async.eachSeries(groups, function(group, cb){
            groupArray.push(group._id);

            // Callback to let eachSeries() know about current group processing
            return cb(null);
        },  function(err) {
            // Iteration completed
            console.log("Added " + groupArray.length + " to the queue...");
            // Check if there more groups that needs to be processed (with another API request)
            if (groupArray.length < total) {
                listGroupsApi({"offset":groupArray.length, "count":count}, function(){
                    return callback(true);
                });
            } else if(groupArray.length === total){
                console.log('Success! Found ' + groupArray.length + ' groups in total.');

                groupArray.forEach(group => {
                    deleteGroupApi(group);
                });

                return callback(true);
            }
        });
    });
}

/**
 * Function to delete a certain private group
 * @param {*} id - id of the group to delete
 * @return {bool} result
 */
function deleteGroupApi(id){
    rocketChatClient.groups.delete(id, function (err, body) {
        if (!err) {
            console.log('Deleted group #' + id);
            return true;
        } else {
            console.log('Couldn\'t delete group #' + id);
            return false;
        }
    })
}

/**
 * Function to repeatetly send rocketChatClient.users.list()
 * to iterate over result pagination (default max count = 100)
 * until final page is received
 * @param {Integer} offset - Optional offset can be passed
 */
function listUsersApi(offset = 0, callback){
    var count = 100;

    // Actual function of REST client to get the available users
    rocketChatClient.users.list(offset, count, function (err, body) {
        if (err) {
            error(err);
        }

        var total = body.total,
            users = body.users;

        // Iterate over each user (asynchronously to not start another request until iteration is completed)
        async.eachSeries(users, function(user, cb){
            // Check if user is an admin one
            if (user.roles.indexOf('admin') > -1 || user.roles.indexOf('bot') > -1) {
                userArrayExcludes.push(user._id);
            } else {
                userArray.push(user._id);
            }

            // Callback to let eachSeries() know about current user processing
            return cb(null);
        },function(err) {
            var usersTotal = userArray.length + userArrayExcludes.length;

            // Iteration completed
            console.log("Added " + userArray.length + " to the queue...");
            // Check if there more users that needs to be processed (with another API request)
            if (usersTotal < total) {
                listUsersApi(usersTotal, count, function(){
                    return callback(true);
                });
            } else if(usersTotal === total){
                console.log('Success! Found ' + userArray.length + ' users in total.');

                userArray.forEach(user => {
                    deleteUserApi(user);
                });

                return callback(true);
            }
        });
    });
}

/**
 * Function to delete a certain user
 * @param {*} id - id of the user to delete
 * @return {bool} result
 */
function deleteUserApi(id){
    rocketChatClient.users.delete(id, function (err, body) {
        if (!err) {
            console.log('Deleted user #' + id);
            return true;
        } else {
            console.log('Couldn\'t delete user #' + id);
            return false;
        }
    })
}

var packagejson = require('./package.json');

// Empty arrays that will hold the objects
var channelArray = [],
    channelArrayExcludes = [],
    groupArray = [],
    userArray = [],
    userArrayExcludes = [];

program
    .version(packagejson.version)
    .description(packagejson.description)
    .option('-c, --channels', 'Purge all (public) channels')
    .option('-g, --groups', 'Purge all (private) groups')
    .option('-u, --users', 'Purge all users except users of roles "admin" and "bot"')
    .parse(process.argv);

// Load configuration object for RocketChat API from JSON
var config = require('./config.json');

// Create client
var rocketChatClient = new RocketChatClient(config);

if (program.channels || program.groups || program.users) {
    // Authenticate using admin credentials stored in config object
    rocketChatClient.authentication.login(config.username, config.password, function(err, body) {
        // Check for errors upon authorization
        if (!err) {
            if (program.channels) {
                listChannelsApi(null, function(){
                    console.log('Channels deleted!');
                });
            }

            if(program.groups){
                listGroupsApi(null, function(){
                    console.log('Groups deleted!');
                });
            }

            if(program.users){
                listUsersApi(null, function(){
                    console.log('Users deleted!');
                });
            }
        } else {
            error(err);
        }
    })
} else {
    program.outputHelp();
    error('No option passed. Aborting...')
}
