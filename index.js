require('dotenv').config();
const Discord = require('discord.js');
var Scryfall = require('scryfall-client');

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

});

  bot.on('error', err => {
    console.warn(err);
 });