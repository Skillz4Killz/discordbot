/**
 * Created by julian on 16.05.2016.
 */
var config = require('../../config/main.json');
var path = require('path');
var voice = require('../utility/voice');
var basicCommands = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case'!w.help':
            bot.reply(message, "Hey im Wolke-Chan," +
                "your Bot for doing Stuff other bots do bad \n" +
                "Commands you can write:" +
                " ```!w.help --> Help \n" +
                "!w.master --> get the name of my Master \n" +
                "!w.bug --> get the Link of the Support Discord \n" +
                "!w.add --> add me to your server \n" +
                "!w.voice --> i join the Voice Channel you are currently in \n" +
                "!w.list --> Lists all Songs that are currently added to the Bot Database\n" +
                "!w.yt youtubelink --> download a Youtube Video max Length: 1H30M\n" +
                "!w.yt.s query --> Searches Youtube and gives you the First Result\n" +
                "!w.yt.sq query --> Searches Youtube and adds the First Result to the Queue\n" +
                "!w.osu maplink --> download a Osu Map\n" +
                "!w.play name --> Play a Song/Youtube Video max Length: 1H30M\n" +
                "!w.pause --> Pause the Current Song\n" +
                "!w.resume --> Resume the pause Song\n" +
                "!w.search name --> Searches for a Song in the Bot Database and shows the 5 best Results\n" +
                "!w.skip --> Skips the Current Song\n" +
                "!w.queue add name --> Adds a Song/Youtube Video to the Queue max Length: 1H30M\n" +
                "!w.queue remove latest --> Adds a Song/Youtube Video to the Queue max Length: 1H30M\n" +
                "!w.queue --> Shows the current Queue\n" +
                "!w.rqueue --> Adds a random Song to the Queue max Length: 1H30M\n" +
                "!w.random --> Plays a Random Song\n" +
                "If you want to talk with me @mention me with a message :D \n" +
                "!w.version --> My Version```");
            return;
        case "!w.master":
            bot.reply(message, 'My Master is Wolke');
            return;
        case "!w.version":
            bot.reply(message, 'I am running on Version ' + config.version);
            return;
        case "!w.add":
            bot.reply(message, "Use this Link to add me to your Server: \<https://discordapp.com/oauth2/authorize?client_id=" + config.client_id + "&scope=bot&permissions=0\>");
            return;
        case "!w.bug":
            bot.reply(message, 'Please join the support Discord: https://discord.gg/yuTxmYn to report a Bug.');
            return;
        case "!w.list":
            bot.reply(message, 'The List of Songs can be found at <http://w.onee.moe>');
            return;
        case "!w.voice":
            if (message.author.voiceChannel) {
                var admin = false;
                for (var role of message.server.rolesOfUser(message.author)) {
                    if (role.name === 'WolkeBot') {
                        admin = true;
                    }
                    if (role.name === "Proxerteam") {
                        admin = true;
                    }
                }
                if (message.server.id === '118689714319392769' && admin || message.server.id === "166242205038673920" && admin || message.server.id !== '118689714319392769' && message.server.id !== "166242205038673920") {
                    bot.joinVoiceChannel(message.author.voiceChannel, function (err, connection) {
                        if (!err) {
                            voice.startQueue(bot, message);
                        } else {
                            console.log(err);
                            bot.reply(message, 'An Error has occured while trying to join Voice!');
                        }
                    });
                } else {
                    bot.reply(message, 'No Permission!');
                }
            } else {
                bot.reply(message, "You are not in a Voice Channel!");
            }
            return;
        case "!w.silent":
            if (!message.channel.isPrivate) {
                var admin = false;
                for (var role of message.server.rolesOfUser(message.author)) {
                    if (role.name === 'WolkeBot') {
                        admin = true;
                    }
                    if (role.name === "Proxerteam") {
                        admin = true;
                    }
                }
                if (voice.inVoice(bot, message)) {
                    if (message.server.id === '118689714319392769' && admin || message.server.id === "166242205038673920" && admin || message.server.id !== '118689714319392769' && message.server.id !== "166242205038673920") {
                        bot.leaveVoiceChannel(message.author.voiceChannel, function (err, connection) {
                            if (err) console.log(err);
                        });
                    } else {
                        bot.reply(message, 'No Permission!');
                    }
                } else {
                    bot.reply(message, 'I am not connected to any Voice Channels on this Server!');
                }
            } else {
                bot.reply(message, 'This Command does not work in private Channels');
            }
            return;
        case "!w.wtf":
            bot.reply(message, "http://wtf.watchon.io");
            return;
        case "!w.stats":
            var plural;
            var users = 0;
            if (bot.servers.length > 1) {
                plural = 'servers';
                for (var i = 0; bot.servers.length > i; i++) {
                    users = users + bot.servers[i].members.length
                }
            } else {
                plural = 'server';
                users = bot.servers[0].members.length;
            }
            users = users - bot.servers.length;
            bot.reply(message, "I am currently used on " + bot.servers.length + " " + plural + " with " + users + " users.");
            return;
        default:
            return;
    }
};
module.exports = basicCommands;