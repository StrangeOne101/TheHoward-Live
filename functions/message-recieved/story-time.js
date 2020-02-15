const data = require("./data");
const storytime = data.load("storytime");

storytime.lastUsers = storytime.lastUsers || [];
storytime.repeatAfter = storytime.repeatAfter || 3;
storytime.bannedWords = storytime.bannedWords || [];

if (channel.id == storytime.channel && storytime.enabled == true && !message.startsWith("#")) {
	if (storytime.lastUsers.indexOf(sender.id) != -1) {
		msgobj.delete().catch(() => {});
		channel.send("<@" + sender.id + "> You must wait till " + (storytime.lastUsers.indexOf(sender.id) + 1 + (storytime.repeatAfter - storytime.lastUsers.length)) +
		` more people add to the story before you can add a word!`).then(message => {
			setTimeout(() => {
				message.delete().catch(() => {}); //Delete message
			}, 1000 * 10); //After 10 seconds
		});
		return;
	}

	if (message.indexOf(" ") != -1 && message.indexOf(".") == -1) {
		msgobj.delete().catch(() => {});
		channel.send("<@" + sender.id + "> You can only send one word at a time!").then(message => {
			setTimeout(() => {
				message.delete().catch(() => {}); //Delete message
			}, 1000 * 10); //After 10 seconds
		});
		return;
	}

	var word = message;
	var end = message.indexOf(".") != -1;

	var originalMessage = channel.fetchMessage(storytime.storyId).then(message => {
		if (message.content == storytime.storyMessage) {
			if (end) {
				channel.send("<@" + sender.id + "> You cannot end the story before it has started!").then(message => {
					setTimeout(() => {
						message.delete().catch(() => {}); //Delete message
					}, 1000 * 10); //After 10 seconds
				});
				msgobj.delete(() => {}); //Delete the message that added the word
				return;
			}
			message.edit("**Story: **" + word);
			msgobj.delete(() => {}); //Delete the message that added the word
			storytime.lastUsers.push(sender.id); //Add user to end the list
			if (storytime.lastUsers.length > storytime.repeatAfter)
				storytime.lastUsers.shift(); //Remove the first element in the list
			return;
		}

		const content = message.content;

		if (end && content.split(" ").length < 5) {
			channel.send("<@" + sender.id + "> The story is too short to end now!").then(message => {
				setTimeout(() => {
					message.delete().catch(() => {}); //Delete message
				}, 1000 * 10); //After 10 seconds
			});
			msgobj.delete(() => {}); //Delete the message that added the word
			return;
		}
		var lastWord = message.content.split(" ")[message.content.split(" ").length - 1];

		if (lastWord.toLowerCase() == word.toLowerCase()) {
			msgobj.delete().catch(() => {});
			channel.send("<@" + sender.id + "> You cannot use the last word added to the story!").then(message => {
				setTimeout(() => {
					message.delete().catch(() => {}); //Delete message
				}, 1000 * 10); //After 10 seconds
			});
			return;
		}

		if (storytime.bannedWords.indexOf(word) != -1) {
			msgobj.delete().catch(() => {});
			channel.send("<@" + sender.id + "> used one of the random banned words and ended the story for everyone! Use `!storytime` to start another story!");
			storytime.enabled = false;
			storytime.lastUsers = [];
			data.save("storytime", storytime); //Save data
			return;
		}

		message.edit(content + " **" + word + "**"); //Add the word but with bold
		setTimeout(() => {
			message.edit(content + " " + word); //Remove bold
		}, 1000 * 1.5);
		msgobj.delete(() => {}); //Delete the message that added the word

		if (end) {
			channel.send("<@" + sender.id + "> has ended the story! Use `!storytime` to start another story!").catch(() => {});
			storytime.enabled = false;
			storytime.lastUsers = [];
		} else {
			storytime.lastUsers.push(sender.id); //Add user to end the list
			if (storytime.lastUsers.length > storytime.repeatAfter)
				storytime.lastUsers.shift(); //Remove the first element in the list
		}

		data.save("storytime", storytime); //Save data
	}).catch(err => {
		console.log("Cannot find message!");
		console.log(err);
		channel.send("Storytime ended abbruptly! Start again with `!storytime`!");
		storytime.enabled = false;
		storytime.lastUsers = [];
		data.save("storytime", storytime); //Save data
	});


}

data.save("storytime", storytime);
