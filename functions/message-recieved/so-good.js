if (message.toLowerCase().startsWith("so good") || message.toLowerCase().startsWith("its so good") || message.toLowerCase().startsWith("oh so good") || message.toLowerCase().startsWith("it's so good")) {
     //sendImage("https://i.imgur.com/nUjSmmd.jpg");
    sendTo(channel, sender, "", {mimic: true, file: "https://i.imgur.com/P0VOebC.png"})
    msgobj.delete().catch( e => {} );
}
