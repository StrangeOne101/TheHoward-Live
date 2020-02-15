const bot = require("./bot");
const fs = require("fs");
var avatarURL;
const name = "The Real Howard";
const webhooks = {}; //An object
const debug = false;
const Discord = require("discord.js");

function setup() {
	avatarURL = bot.user.avatarURL;
	fs.access("mimic_webhooks.csv", fs.constants.F_OK, function(err) {
		if (!err) {
			fs.readFile("mimic_webhooks.csv", "utf8", function (err2, data) { //File is a csv. So format is snowflake,id,token\r\n
				if (!err2) {
					var lines = data.split("\r\n");
					var requests = 0;
					for (var l in lines) {
						var line = lines[l];
						const snowflake = line.split(",")[0];
						const id = line.split(",")[1];
						const token = line.split(",")[2];
						bot.client.fetchWebhook(id, token).then(webhook => {
							webhooks[snowflake] = webhook;
							//console.log("Found webhook: " + snowflake + "," + id + "," + token);
							requests++;

							if (requests == lines.length) { //This is the last request
								addAllGuildChannels(); //Add channels not saved since last time
								console.log("Loaded " + requests + " webhooks from file.")
							}
						}).catch(err => console.log("Failed to fetch webhook no. " + requests++ + ": " + err));
					}
				}
			});
		} else { //File doesn't exist. It will be created when appending to the file anyway
			console.log("No webhooks found from file... creating them now")
			addAllGuildChannels();
		}
	});
}

function mimicUser(user, message, channel, attachment) {
	if (webhooks[channel.id]) {
		var hook = webhooks[channel.id];
		const name = hook.name;
		if (!(user instanceof Discord.GuildMember) && channel instanceof Discord.TextChannel) {
			//console.log("Getitng nickname")
			channel.guild.fetchMember(user).then(member => {
				hook.edit(member.nickname || user.username, user.avatarURL)
					.then(hook => hook.send(message, attachment || {})
					.then(hook => hook.edit(name)))
					.catch(err => console.log("Failed to mimic user: " + err));
			}).catch(err => console.log("Failed to mimic user: " + err));
		} else {
			hook.edit(user.username, user.avatarURL)
				.then(hook => hook.send(message, attachment || {})
				.then(hook => hook.edit(name)))
				.catch(err => console.log("Failed to mimic user: " + err));
		}


	}
}

function addAllGuildChannels() {
	console.log("DEBUG Guilds: " + bot.client.guilds.array());
	for (var i in bot.client.guilds.array()) {
		var guild = bot.client.guilds.array()[i];
		console.log("Creating webhooks for guild '" + guild.name + "'");
		for (var j in guild.channels.array()) {
			const channel = guild.channels.array()[j];

			if (!(webhooks[channel.id]) && channel instanceof Discord.TextChannel) { //If it doesn't contain a hook for the channel
				channel.createWebhook("Bot " + "(" + channel.name + ")", avatarURL, "Mimic Webhook")
					.then(webhook => webhook.edit("Bot " + "(" + channel.name + ")", avatarURL, "Mimic Webhook"))     //Because it doesn't create correctly, we have
					.then(webhook => {
						if (debug) {
							webhook.send("Webhook created!");
						}
						webhooks[channel.id] = webhook;
						fs.appendFileSync('mimic_webhooks.csv', `${channel.id},${webhook.id},${webhook.token}\r\n`);
						console.log("Registered new webhook for channel " + channel.name + " (" + channel.id + ")");
					})  //to set the details again
					.catch(error => console.log("Failed to register webhook: " + error));
			}

		}
	}
}


function canMimic(channel) {
	if ((channel instanceof Discord.TextChannel && webhooks[channel.id]) || webhooks[channel]) return true;

	return false;
}

exports.setup = setup;
exports.canMimic = canMimic;
exports.mimicUser = mimicUser;
