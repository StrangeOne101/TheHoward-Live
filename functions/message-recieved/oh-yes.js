if (!sender.bot && (message.toLowerCase().startsWith("o yes") || message.toLowerCase().startsWith("oh yes"))) {
     //sendImage("https://i.imgur.com/nUjSmmd.jpg");
    sendTo(channel, sender, message, {mimic: true, file: "https://i.kym-cdn.com/photos/images/newsfeed/000/318/580/c97.png"})
    //reply(sender.id + " | " + botUser.id);
    msgobj.delete().catch( e => {} );
}
