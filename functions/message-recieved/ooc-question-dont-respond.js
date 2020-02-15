if (channel.id == "672763530016980992" && !sender.bot) {
  if (message.trim().toLowerCase() == "no") {
    channel.send("Yes.")
    msgobj.delete().catch( e => {} );
  } else if (message.trim().toLowerCase() == "yes") {
    channel.send("No.")
    msgobj.delete().catch( e => {} );
  }
}
