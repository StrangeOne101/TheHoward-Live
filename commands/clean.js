if (sender.id != "145436402107154433") {
	//send("");
	return;
}
var chrono = require('chrono-node');
if (args.length == 0) {
	send("Command is `!clean [channel] <time> <regex>`");
	return;
}

var chan = channel;

if (args[0].match("<#[0-9]{14,20}>") != null) { //329546144143376384
	var chanstr = args[0].substring(2, args[0].length - 1);
	if (channel.guild.channels.get(chanstr) == null) {
		send("Invalid channel! Usage is `!clean [channel] <time> <regex>`");
		return;
	}
	chan = channel.guild.channels.get(chanstr);
	args.shift();
}

var time = chrono.parseDate("-" + args[0]);

var regex = args.splice(1, args.length - 1).join(" ");

try {
	var pattern = new RegExp(regex);

	chan.fetchMessages({}).then(messages => {
		send("Starting cleaning of " + channel.name + " (" + messages.size + " messages to sort)");
		
		var count = 0;

		for (var [snowflake, message] in messages.entries()) {
			console.log("Content: " + content + " | " + message.createdTimestamp + " | " + time.getTime());
			if (pattern.match(message.content) && message.createdTimestamp > time.getTime()) {
				message.delete().then( () => count++ ).catch(e => send("Failed to delete message: " + e));
			}
		}
	}).catch(e => send("Error occured while fetching messages: " + e));
} catch (e) {
	send("Error: " + e);
}

