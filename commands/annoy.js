if (args.length == 0) {
	send("Command is `!annoy <user>`");
	return;
}

var nick = args.join(" ");

var annoyingText = ["That's awesome for someone like you", "There is no more icecream left", "https://cdn.discordapp.com/attachments/410705073229004802/511092482008678400/7fd.png", "Not sure", "Why tho", "I'll meet you there never", "Do it! Finish this once and for all!", "Not even a school shooter could kill me harder than you are right now", "She is ***hot***"];
var replyText = annoyingText[Math.floor(Math.random() * annoyingText.length)];

var foundUser = null;
for (var [snowflake, member] of channel.guild.members) {
	if (member.nickname != null && member.nickname.toLowerCase() == nick.toLowerCase()) {
		foundUser = member.user; //Because member is a GuildMember object
		break;
	}

	if (member.user.username.toLowerCase() == nick.toLowerCase()) {
		foundUser = member.user;
		break;
	}
}

if (foundUser == null) {
	send("User not found!");
	return;
}

msgobj.delete();
console.log(foundUser);
console.log(replyText);

msgobj.channel.send("<@" + foundUser.id + "> " + replyText).then(msg => msg.delete());

setTimeout(() => {
	replyText = annoyingText[Math.floor(Math.random() * annoyingText.length)];
	msgobj.channel.send("<@" + foundUser.id + "> " + replyText).then(msg => msg.delete());
}, 1000 * 60 * 42);

setTimeout(() => {
	replyText = annoyingText[Math.floor(Math.random() * annoyingText.length)];
	msgobj.channel.send("<@" + foundUser.id + "> " + replyText).then(msg => msg.delete());
}, 1000 * 60 * (42 + (Math.random() * 60) + 10));

setTimeout(() => {
	replyText = annoyingText[Math.floor(Math.random() * annoyingText.length)];
	msgobj.channel.send("<@" + foundUser.id + "> " + replyText).then(msg => msg.delete());
}, 1000 * 60 * (42 + (Math.random() * 60) + 60));

setTimeout(() => {
	replyText = annoyingText[Math.floor(Math.random() * annoyingText.length)];
	msgobj.channel.send("<@" + foundUser.id + "> " + replyText).then(msg => msg.delete());
}, 1000 * 60 * (42 + (Math.random() * 60) + 120));