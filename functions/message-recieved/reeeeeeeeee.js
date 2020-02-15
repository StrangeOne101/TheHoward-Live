if (!sender.bot && (message.toLowerCase().startsWith("reee"))) {
     //sendImage("https://i.imgur.com/nUjSmmd.jpg");
    sendTo(channel, sender, message, {mimic: true, file: "https://i.imgur.com/SnW9DKO.png"})
    //reply(sender.id + " | " + botUser.id);
    msgobj.delete().catch( e => {} );
}
