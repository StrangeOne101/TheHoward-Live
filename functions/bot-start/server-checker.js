const data = require("./data");
const mc = require("minecraft-protocol");
var serverChecker = data.load("server-checker");
serverChecker.enabled = serverChecker.enabled || true;
serverChecker.channel = serverChecker.channel || "407738236954476545";
serverChecker.online = serverChecker.online || false;
serverChecker.ip = serverChecker.ip || "121.74.120.133";
serverChecker.broadcast = serverChecker.broadcast || "Server is back up again! Join at `%ip%`";
data.save("server-checker", serverChecker); //Save default

setInterval(function() {
  serverChecker = data.load("server-checker");
  if (!serverChecker.enabled) return;

  mc.ping({
  "host": serverChecker.ip,

}, function(err, o) {
    if (err && err.errno) {
      if (serverChecker.online == true) {
          console.log("MC server " + serverChecker.ip + " has gone down");
      }
      //console.log(o);
      serverChecker.online = false;
      data.save("server-checker", serverChecker); //Save default
      return;
    }

    //console.log(o);

    if (serverChecker.online == false) {
      serverChecker.online = true;
      console.log("MC server " + serverChecker.ip + " has gone back up!");
      data.save("server-checker", serverChecker); //Save default
      var channel = client.channels.get(serverChecker.channel);
      if (channel) {
        channel.send(serverChecker.broadcast.replace("%ip%", serverChecker.ip));
      }
    }
  });
}, 30 * 1000);
