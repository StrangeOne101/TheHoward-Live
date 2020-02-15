const data = require("./data");
const storytime = data.load("storytime");

if (!storytime.enabled) {
    channel.send("There is not a storytime going on at the moment!");
    return;
}

channel.fetchMessage(storytime.storyId).then(message => {
    var lastWord = message.content.split(" ")[message.content.split(" ").length - 1];

    var editedMsg = message.content.substring(0, message.content.length - (lastWord.length + 1));
    message.edit(editedMsg);
    channel.send("<@" + sender.id + "> removed the last word! Remember, words must make sense!").then((m) => {
        setTimeout(() => {
            m.delete().catch(() => {});
        }, 1000 * 10);
    });
    msgobj.delete().catch(() => {});

});
