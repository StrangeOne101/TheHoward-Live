const Discord = require('discord.js');
const fs = require("fs");
const http = require("http");
var config = require("./config");
console.log('******* Bot starting *******');
config.load();
const ChatHandler = require("./chathandler");
const Mimic = require("./mimic");

var user;

var time;

function setTime() {
	time = Date.now();
}

function getTime() {
	console.log("Took " + (Date.now() - time) + "ms");
}

exports.setTime = setTime;
exports.getTime = getTime;


// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.getToken();

// The ready event is vital, it means that your bot will only start reacting to information

var instance = this;
// from Discord _after_ ready is emitted
client.on('ready', () => {
  client.generateInvite(['SEND_MESSAGES'])
  .then(link => {
    console.log(`Generated bot invite link: ${link}`);
  });
  ChatHandler.setParent(instance);

  console.log("Loaded " + config.getOps().length + " op(s) and " + config.getBarredUsers().length + " barred user(s)");
  exports.client = client;
  exports.user = client.user;
  exports.me = client.guilds.first().me;
  user = client.user;

  Mimic.setup();

	fs.readdir("functions/bot-start", function(err, items) {
		//console.log(items);

		var fileData = [];

		for (var i=0; i<items.length; i++) {
			fs.readFile("functions/bot-start/" + items[i], function(err, data) {
				fileData.push(data);

				if (fileData.length == items.length) {
					for (var j = 0; j < fileData.length; j++) {
						var thisFileData = fileData[j];

						try {
							eval("function execute() { " + thisFileData + " }; execute();");
						} catch (exception) {
							console.log(exception);
						}
					}
				}
			});
		}
	});

  //client.user.setStatus("online");
});

client.on("disconnect", function() {
	//client.user.setStatus("dnd");
});

client.on("error", error => {
	console.log(error.error.errno);
	if (error.error.errno == "ECONNRESET") {
		console.log("=== CONNECTION RESET ===");
		console.log("Logging in again...");
		boot();
	}

})

// Create an event listener for messages
client.on('message', message => {

	ChatHandler.handle(message.content, message.author, message.channel, message);
	console.log("[#" + message.channel.name + "] " + message.author.username + ": " + message.content);
});

function boot(tryagain) {
	console.log("Logging in...");
	var time = tryagain || 15;
	var timeString = time < 60 ? time + " second" : (time / 60) + " minute";
	if (time != 0 && time != 60) timeString += "s";
	// Log our bot in
	client.login(token).catch(e => {
		console.log("Failed to log in: " + e);
		console.log(`Trying again in ${timeString}...`);
		setTimeout(function() {
			boot(time * 2);
		}, 1000 * time);
	});
}

boot();
