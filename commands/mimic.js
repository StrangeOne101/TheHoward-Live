//send("args: '" + args + "'")
const Mimic = require("./mimic");
const Discord = require("discord.js");
if (args.length == 0) {
	send("Usage is `!mimic [user] <message>`");
}

var mess = args.join(" ");

var foundUser = null;
for (var [snowflake, member] of channel.guild.members) {
	if (snowflake == args[0]) {
		foundUser = member.user;
		break;
	}

	if (member.nickname != null && member.nickname.toLowerCase() == args[0].toLowerCase()) {
		foundUser = member.user; //Because member is a GuildMember object
		break;
	}

	if (member.user.username.toLowerCase() == args[0].toLowerCase()) {
		foundUser = member.user;
		break;
	}
}

if (foundUser == null) {
	foundUser = sender;
} else {
	mess = mess.substring(args[0].length + 1);
}


if (args[0] == "debug") {
	send("CanMimic: " + Mimic.canMimic(channel));
	return;
} else if (args[0] == "clearall") {
	channel.guild.fetchWebhooks()
		.then(hooks => hooks.forEach(e => e.delete()))
		.then(send("Deleted all webhooks!"))
		.catch(err => {
			console.log(err);
			send("An error occured: " + err);
		})
		return;
}
	sendTo(channel, foundUser, mess, {mimic: true});
	msgobj.delete().catch( e => {} );
