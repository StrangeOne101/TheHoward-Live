const data = require("./data");
const storytime = data.load("storytime");
//const h2p = require('html2plaintext');

var ongoing = storytime.enabled || false;
storytime.startMessage = storytime.startMessage || "@here Story time! Type a word (only one!) in to add to the story! Certain random words will ruin the story, so be careful!\nNeed te story to end? End your word with a full stop.";
storytime.storyMessage = storytime.storyMessage || "(No story yet)";
storytime.repeatAfter = storytime.repeatAfter || 3;

if (!ongoing) {
    storytime.channel = channel.id;
    channel.send(storytime.startMessage + "\n").catch(() => {});;

    if (args.length > 0) {
        var topic = args.join(" ");
        channel.send("The topic this time around is **" + topic + "**!");
    }

    channel.send(storytime.storyMessage).then(message => storytime.storyId = message.id).catch(() => {});;
    storytime.enabled = true;
    data.save("storytime", storytime);


    var bannedWords = [];
    /*var r1 = request.post('https://www.getrandomthings.com/data/random-verbs.php', {
        json: {
            "num": 20,
            "add": "address",
            "unique": true
        }
    }, (error, res, body) => {
        if (error) {
            console.error(error);
            return;
        }
        var words = h2p(body).split(" ");
        bannedWords.concat(words);

        console.log(bannedWords);
        console.log(body);
    });

    var r2 = request.post('https://www.getrandomthings.com/data/random-nouns.php', {
        json: {
            "num": 40,
            "add": "address"
            ,"unique": true
        }
      }, (error, res, body) => {
          if (error) {
              console.error(error);
              return;
          }
          var words = h2p(body).split(" ");
          bannedWords.concat(words);
          console.log(bannedWords);
    });
    var r3 = request.post('https://www.getrandomthings.com/data/random-adjectives.php', {
        json: {
            "num": 20,
            "add": "address"
            ,"unique": true
        }
    }, (error, res, body) => {
        if (error) {
            console.error(error);
            return;
        }
        var words = h2p(body).split(" ");
        bannedWords.concat(words);

        console.log(bannedWords);
    });

    Promise.all([r1, r2, r3]).then(() => {
        storytime.bannedWords = bannedWords;
        data.save("storytime", storytime);
    });*/
} else {
    msgobj.delete().catch(() => {});
    channel.send("<@" + sender.id + "> There is already a storytime going in <#" + storytime.channel + ">!")
    .then(msg => {
        setTimeout(() => {
            msg.delete(() => {});
        }, 10 * 1000);
    }).catch(() => {});
    return;
}
