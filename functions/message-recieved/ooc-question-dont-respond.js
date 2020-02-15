if (channel.id == "672763530016980992" && !sender.bot) {
  if (message.trim().toLowerCase() == "no") {
    channel.send("yes")
  } else if (message.trim().toLowerCase() == "yes") {
    channel.send("no")
  }
}
