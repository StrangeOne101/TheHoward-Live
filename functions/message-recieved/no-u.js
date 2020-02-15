if (message.toLowerCase().startsWith("no u") || message.toLowerCase().startsWith("no you") || message.toLowerCase().startsWith("uno reverse card")) {
     //sendImage("https://i.imgur.com/nUjSmmd.jpg");
    sendTo(channel, sender, "", {mimic: true, file: "https://i.imgur.com/nUjSmmd.jpg"})
    msgobj.delete().catch( e => {} );
}
