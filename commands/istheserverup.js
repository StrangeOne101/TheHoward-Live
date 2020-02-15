const data = require("./data");
const mc = require("minecraft-protocol");
var serverChecker = data.load("server-checker");
serverChecker.enabled = serverChecker.enabled || true;
serverChecker.channel = serverChecker.channel || "407738236954476545";
serverChecker.online = serverChecker.online || false;
serverChecker.ip = serverChecker.ip || "121.74.120.133";
data.save("server-checker", serverChecker); //Save default

if (!serverChecker.enabled) {
   channel.send("The server pinger is not enabled right now! Get Toby to enable it if this if it should be");
   return;
}

mc.ping({
"host": serverChecker.ip,
}, function(err, o) {
  if (err && err.errno) {
      channel.send("The server is not online right now!");
      return;
  }

  channel.send("The server is currently online with " + o.players.online + "/" + o.players.max + " in game! IP is " + serverChecker.ip + " on version " + o.version.name);
  if (o.players.online > 0) {
    console.log(o.players.sample);
    channel.send("Currently Online: " + (o.players.sample.map(s => s.name).join(", ")));
  }
});
