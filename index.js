require('dotenv').config();
const Discord = require('discord.js');
var Scryfall = require('scryfall-client');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content.search("!muddle")>=0) {
    try {
      var requests = [];
      for (var i=0; i<2; i++) {
        requests.push(Scryfall.get('cards/random', { q: "-t:basic" }));
      }
      Promise.all(requests).then(function (randomCards) {
        var message = randomCards.map(card => card["scryfall_uri"]).join("\n");
        msg.reply(message);
      }
      );      
    } catch (err) {
        // There are various reasons why sending a message may fail.
        // The API might time out or choke and return a 5xx status,
        // or the bot may not have permission to send the
        // message (403 status).
        console.warn('Something went wrong!');
        console.warn(err);
    }
  }
  else if (msg.content.search("!randcolor")>=0) {
    match = msg.content.match(/!randcolor (\d)/);
    if (match.len > 1) numColors = match[1];
    else numColors = 1;
    colors = shuffle(["white","blue","black","red","green"]).slice(0,numColors+1);
    msg.reply(colors.join(", "));
  }

});

  bot.on('error', err => {
    console.warn(err);
 });