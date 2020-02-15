if (!(message.toLowerCase().startsWith("tell me lies") || message.toLowerCase().startsWith("tell me a lie") || message.toLowerCase().startsWith("todd howard is full of shit") || message.toLowerCase().startsWith("todd howard lies"))) return;

var lies = ["Fallout 76 was my greatest success", "I never lie!", "Skyrim was based off a true story", "We present to you \"Skyrim: The Anime\"!", "It just works!", "Error: SyntaxError: Unexpected token }", "*Oh! You're finally awake!*", "I am happy to announce that we are bring Skyrim... to the nokia!"];

var replyText = lies[Math.floor(Math.random() * lies.length)] + "\n";


msgobj.channel.send(replyText);