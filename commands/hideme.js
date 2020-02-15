const dutil = require("./scripts/discord-util");

var person = sender;
var channel = "";

if (args.length == 0) {
    msgobj.channel.send("<@" + sender.id + "> Usage is `!hideme <channel>`").then(message => {
        setTimeout(() => {
            message.delete().catch(() => {}); //Delete message
        }, 1000 * 10); //After 10 seconds
    });
    msgobj.delete().catch(() => {});
    return;
}

channel = dutil.getChannel(args[0]);

if (channel == null) {
    msgobj.channel.send("<@" + sender.id + "> Could not find channel `" + args[0] + "`!").then(message => {
        setTimeout(() => {
            message.delete().catch(() => {}); //Delete message
        }, 1000 * 10); //After 10 seconds
    });
    msgobj.delete().catch(() => {});
    return;
}

if (args.length > 1 && dutil.getUser(args[1]) != null) {
    person = dutil.getUser(args[1]);
}

var member = channel.guild.members.get(person.id);

if (member == null) {
    msgobj.channel.send("<@" + sender.id + "> Could not find member `" + args[0] + "` in that guild!").then(message => {
        setTimeout(() => {
            message.delete().catch(() => {}); //Delete message
        }, 1000 * 10); //After 10 seconds
    });
    msgobj.delete().catch(() => {});
    return;
}

var perms = channel.permissionsFor(person);
var b = perms.has("VIEW_CHANNEL", false); //VIEW_CHANNEL flag
console.log(b);

channel.overwritePermissions(sender, {
    VIEW_CHANNEL: !b
}).then(() => {
    msgobj.channel.send("<@" + sender.id + "> You can " + (b ? "no longer" : "now") + " view #" + channel.name + "!").then(message => {
        setTimeout(() => {
            message.delete().catch(() => {}); //Delete message
        }, 1000 * 60); //After 10 seconds
    });
    msgobj.delete().catch(() => {});
    return;
}).catch((e) => {
    msgobj.channel.send("Failed to set perms: " + e).then(message => {
        setTimeout(() => {
            message.delete().catch(() => {}); //Delete message
        }, 1000 * 60); //After 10 seconds
    });
    msgobj.delete().catch(() => {});
});
