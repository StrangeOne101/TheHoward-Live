var http = require("http");
var config = require("./config");
var discord = require("discord.js");
const Mimic = require("./mimic");
var fs = require("fs");

var parentM;

var barred = [];

var emoji_tickbox = "\u2705";
var emoji_cross = "\u274C";

function handle(message, sender, channel, msgobj) {
	//var isOp = sender.id == "145436402107154433"; //ID of the owner of the bot
	var isOp = config.isOp(sender.id);



	if (config.isBarred(sender.id) && !isOp) return;
	if (isChannelIgnored(channel)) return;
	if (sender.id == parentM.user.id) return;

	parentM.setTime();

	if (message.startsWith("!")) {
		//This cuts the first arg off and splits the rest
		var args = message.substr(message.substr(1).split(" ")[0].length + 1 + (message.indexOf(' ') != -1 ? 1 : 0)).split(" ");
		if (args[0] == '') args = [];
		try {
			handleCommand(message.substr(1).split(" ")[0].toLowerCase(), args, sender, channel, msgobj);
		} catch (exception) {
			console.log(exception);
			sendTo(channel, sender, "An error occured while running this command. Please check the console.")
		}


	} else {
		var botUser = parentM.user;
		var client = parentM.client;
		fs.readdir("functions/message-recieved", function(err, items) {
			//console.log(items);

			var fileData = [];

			for (var i=0; i<items.length; i++) {
				fs.readFile("functions/message-recieved/" + items[i], function(err, data) {
					fileData.push(data);
					//console.log("Read file! Length of " + data);

					if (fileData.length == items.length) {
						for (var j = 0; j < fileData.length; j++) {
							var thisFileData = fileData[j];
							function send(text) {
								sendTo(channel, sender, text);
							}

							function sendImage(text) {
								sendTo(channel, sender, "", {file: text});
							}

							var reply = send;

							var evalLine = "function execute() {" + thisFileData + "} execute();"
							try {
								var result = eval(evalLine);
								if (result == 1 || result == true) {
									break;
								}
							} catch (exception) {
								sendTo(channel, sender, "Error: " + exception.toString());
							}
						}
					}
				});
			}
		});
	}
}

function handleCommand(command, args, sender, channel, msgobj) {
	var isOp = config.isOp(sender.id);
	if (command == "debug") {
		channel.send(channel, sender, "Author: " + sender + ", ID: " + sender.id)
	}

	else if (command == "reload" && isOp) {
		sendTo(channel, sender, "Reloading... one moment");
		config.load();
		fetchChatStuff(function(size) {
			sendTo(channel, sender, "Reload successful! Loaded " + size + " regex commands!");
		});
	} else if (command == "latency") {
		sendTo(channel, sender, "Current ping: " + parentM.client.ping);
	} else if (command == "bar" && isOp) {
		if (msgobj.mentions.users.size == 0) {
			sender.send("Incorrect usage! Make sure you specify a user! Usage: `!bar @user`");
			msgobj.react(emoji_cross);
		} else {
			for (var [id, user] of msgobj.mentions.users) {
				config.barUser(id);
			}
			msgobj.react(emoji_tickbox);
		}
	} else if (command == "unbar" && isOp) {
		if (msgobj.mentions.users.size == 0) {
			sender.send("Incorrect usage! Make sure you specify a user! Usage: `!unbar @user`");
			msgobj.react(emoji_cross);
		} else {
			for (var [id, user] of msgobj.mentions.users) {
				config.unbarUser(id);
			}
			msgobj.react(emoji_tickbox);
		}
	} else {
		var botUser = parentM.user;
		var client = parentM.client;
		fs.access("commands/" + command + ".js", fs.constants.F_OK, function(e) {
			fs.readFile("commands/" + command + ".js", function (e2, data) {
				function send(text, attachment) {
					sendTo(channel, sender, text, attachment);
				}

				function sendImage(text) {
					sendTo(channel, sender, "", {file: text});
				}

				var reply = send;

				var evalLine = "function execute() {" + data + "} execute();"
				try {
					eval(evalLine);
				} catch (exception) {
					sendTo(channel, sender, "Error: " + exception.toString());
				}
			});
		});
	}
}

/**
 * Send a message to a person. Depending on the channel, it may
 * be send via the channel or via DM.
 */
function sendTo(channel, sender, message, attachment) {
	if (!(channel instanceof discord.TextChannel)) { //If it's not a text channel, just reply. For group DMs or single DMs
		if (attachment && attachment.mimic && Mimic.canMimic(channel)) {
			Mimic.mimicUser(sender, "`" + message + "`", channel, attachment);
			return;
		}
		channel.send(message, attachment ? attachment : {});
		return;
	}

	var loud = config.getLoudChannels().indexOf(channel.name) !== -1;
	var quiet = config.getQuietChannels().indexOf(channel.name) !== -1;

	if (!loud && !quiet) {
		loud = config.getDefaultChannelType().toLowerCase() == "loud";
		quiet = !loud;
	}

	if (loud) { //If the bot is allowed to be voiced in the channel
		if (attachment && attachment.mimic && Mimic.canMimic(channel)) {
			Mimic.mimicUser(sender, message, channel, attachment);
			return;
		}
		channel.send(message, attachment ? attachment : {});
	} else if (quiet) { //DM them the message if the bot can't reply to the channel
		sender.send(message, attachment ? attachment : {});
	} else {
		throw Exception("wtf is going on here?!?");
	}
}

/**
 * Returns true if the provided channel should be ignored.
 */
function isChannelIgnored(channel) {
	return channel instanceof discord.TextChannel && config.getIgnoredChannels().indexOf(channel.name) !== -1;
}

/**
 * Makes an HTTP request to the given url and
 * calls callback(html)
 */
function request(url, callback) {
	if (url.startsWith("https://")) url = url.substr(8);
	else if (url.startsWith("http://")) url = url.substr(7);

	var urlbase = url.split("/")[0];
	var tempArray = url.split("/");
	tempArray.reverse().pop();
	tempArray.reverse();
	var path = "/" + tempArray.join("/");

	//console.log("URL BASE: " + urlbase);
	//console.log("Path: " + path);

	http.get({
		hostname: urlbase,
		path: path,
		agent: false
	}, (response) => {
		var body = '';
		response.on('data', function(d) {
            body += d;
            //console.log("HTTP REQUEST GOT: " + d)
        });
		response.on('end', function() {
			callback(body);
		});
	})
}
exports.handle = handle;
exports.setParent = function(module) {
	parentM = module;
}
